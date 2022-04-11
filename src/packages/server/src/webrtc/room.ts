import {
   ConnectTransportRequest,
   CreateTransportRequest,
   CreateTransportResponse,
   InitializeConnectionRequest,
   ProducerSource,
   TransportProduceRequest,
   TransportProduceResponse,
} from '../shared/webrtc-types';
import { SuccessOrError } from './../shared/communication-types';
import { MediaKind, Router, RtpCapabilities, WebRtcTransportOptions } from 'mediasoup/node/lib/types';
import ClientMessenger from './client-messenger';
import Connection from './connection';
import { MediasoupMixer } from './mediasoup-mixer';
import * as errors from '../errors';
import Logger from '../utils/logger';
import { setScreenContent } from '../screen-content-manager';

const logger = new Logger('Room');

/**
 * A webrtc room
 */
export default class Room {
   private connections = new Map<string, Connection>();
   private mixer: MediasoupMixer;

   constructor(
      public name: string,
      private router: Router,
      private signal: ClientMessenger,
      private contentChanged: (sharing: boolean) => void,
      private options: WebRtcTransportOptions,
      private maxIncomingBitrate?: number,
   ) {
      this.mixer = new MediasoupMixer(router, signal);
   }

   get routerCapabilities(): RtpCapabilities {
      return this.router.rtpCapabilities;
   }

   /**
    * Add a new user to the room
    */
   public addUser(userId: string) {
      this.connections.set(userId, new Connection(userId));
   }

   /**
    * Remove a user from the room
    */
   public async removeUser(userId: string): Promise<SuccessOrError> {
      const connection = this.connections.get(userId);

      if (!connection) return { success: false, error: errors.userNotFound(userId) };

      this.connections.delete(userId);

      if (connection.receiveTransport) {
         await this.mixer.removeReceiveTransport(connection.id);
      }

      for (const [, producer] of connection.producers) {
         this.mixer.removeProducer(producer.id);

         producer.close();
      }
      for (const [, consumer] of connection.consumers) {
         consumer.close();
      }
      for (const [, transport] of connection.transports) {
         transport.close();
      }

      return { success: true };
   }

   get hasUsers() {
      return this.connections.size > 0;
   }

   public close() {
      throw 'Not implemented';
   }

   public initializeConnection(info: InitializeConnectionRequest, userId: string): SuccessOrError {
      const connection = this.connections.get(userId);
      if (!connection) return { success: false, error: errors.userNotFound(userId) };

      if (connection.initializedInfo) {
         return { success: false, error: errors.invalidOperation('Already initialized') };
      }

      connection.initializedInfo = info;
      return { success: true };
   }

   /**
    * Initialize a new transport
    */
   public async createTransport(
      { sctpCapabilities, forceTcp, producing, consuming }: CreateTransportRequest,
      userId: string,
   ): Promise<SuccessOrError<CreateTransportResponse>> {
      const connection = this.connections.get(userId);
      if (!connection) return { success: false, error: errors.userNotFound(userId) };

      if (!connection.initializedInfo) return { success: false, error: errors.invalidOperation('Not initialized') };

      if (connection.receiveTransport && consuming)
         return { success: false, error: errors.invalidOperation('Already has receive transport') };

      if (connection.sendTransport && producing)
         return { success: false, error: errors.invalidOperation('Already has send transport') };

      logger.debug('createTransport() | connectionId: %s', connection.id);

      const webRtcTransportOptions: WebRtcTransportOptions = {
         ...this.options,
         enableSctp: Boolean(sctpCapabilities),
         numSctpStreams: sctpCapabilities?.numStreams,
         appData: { producing, consuming },
      };

      if (forceTcp) {
         webRtcTransportOptions.enableUdp = false;
         webRtcTransportOptions.enableTcp = true;
      }

      const transport = await this.router.createWebRtcTransport(webRtcTransportOptions);

      if (consuming) {
         connection.receiveTransport = transport;
         await this.mixer.addReceiveTransport(connection);
      }

      if (producing) connection.sendTransport = transport;
      connection.transports.set(transport.id, transport);

      // If set, apply max incoming bitrate limit.
      if (this.maxIncomingBitrate) {
         try {
            await transport.setMaxIncomingBitrate(this.maxIncomingBitrate);
         } catch (error) {}
      }

      return {
         success: true,
         response: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters,
         },
      };
   }

   /**
    * Connect the transport after initialization
    */
   public async connectTransport(payload: ConnectTransportRequest, userId: string): Promise<SuccessOrError> {
      const connection = this.connections.get(userId);
      if (!connection) return { success: false, error: errors.userNotFound(userId) };

      const transport = connection.transports.get(payload.transportId);
      if (!transport) return { success: false, error: errors.invalidOperation('Transport not found') };

      logger.debug('connectTransport() | id: %s', connection.id);

      await transport.connect(payload);
      return { success: true };
   }

   /**
    * Create a new producer in an existing transport
    */
   public async transportProduce(
      { transportId, appData, kind, ...producerOptions }: TransportProduceRequest,
      connectionId: string,
   ): Promise<SuccessOrError<TransportProduceResponse>> {
      const connection = this.connections.get(connectionId);
      if (!connection) return { success: false, error: errors.userNotFound(connectionId) };

      const transport = connection.transports.get(transportId);
      if (!transport) return { success: false, error: errors.invalidOperation('Transport not found') };

      const source: ProducerSource = appData.source;
      if (!this.verifyProducerSource(kind, source))
         return { success: false, error: errors.invalidOperation('Invalid producer kind') };

      appData = { ...appData, participantId: connection.id };

      const producer = await transport.produce({
         ...producerOptions,
         kind,
         appData,
      });

      if (connection.producers.get(source)) {
         connection.producers.get(source)?.close();
         connection.producers.delete(source);
      }

      producer.on('score', (score) => {
         this.signal.notifyProducerScore(connection.id, { producerId: producer.id, score });
      });

      producer.on('transportclose', () => {
         this.contentChanged(false);
      });

      connection.producers.set(producer.id, producer);

      this.mixer.addProducer({ producer, participantId: connection.id });

      this.contentChanged(true);

      return { success: true, response: { id: producer.id } };
   }

   private verifyProducerSource(kind: MediaKind, source: ProducerSource): boolean {
      if (source === 'mic' && kind === 'audio') return true;
      if (source === 'screen' && kind === 'video') return true;
      if (source === 'webcam' && kind === 'video') return true;

      return false;
   }
}
