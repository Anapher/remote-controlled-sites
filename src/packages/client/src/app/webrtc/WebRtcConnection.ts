import debug from 'debug';
import { Socket } from 'socket.io-client';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Device } from 'mediasoup-client';
import { MediaKind, RtpParameters, Transport, Consumer } from 'mediasoup-client/lib/types';

import { EventSubscription, subscribeEvent, unsubscribeAll } from '../../utils/event-emitter-utils';
import { ChangeStreamRequest, ProducerSource } from '../../shared/webrtc-types';
import { RestClientWebRtc } from './types';
import {
   RESPONSE_CONSUMER_CLOSED,
   RESPONSE_CONSUMER_CREATED,
   RESPONSE_CONSUMER_PAUSED,
   RESPONSE_CONSUMER_RESUMED,
   RESPONSE_PRODUCER_CHANGED,
} from '../../shared/ws-server-messages';

type OnNewConsumerPayload = {
   participantId: string;
   producerId: string;
   id: string;
   kind: MediaKind;
   rtpParameters: RtpParameters;
   type: string;
   appData: any;
   producerPaused: boolean;
};

export type ProducerChangedEventArgs = {
   source: ProducerSource;
   action: 'pause' | 'resume' | 'close';
   producerId: string;
};

type ConsumerInfoPayload = {
   consumerId: string;
};

const PC_PROPRIETARY_CONSTRAINTS = {
   optional: [{ googDscp: true }],
};

const log = debug('webrtc:connection');

export class WebRtcConnection extends TypedEmitter {
   /** SignalR methods that were subscribed. Must be memorized for unsubscription in close() */
   private signalrSubscription = new Array<EventSubscription>();
   private pendingConsumers = new Array<OnNewConsumerPayload>();

   private joiningConsumers = new Map<string, number>();
   private joiningConsumersId = 0;

   private consumers = new Map<string, Consumer>();

   constructor(private connection: Socket, private client: RestClientWebRtc) {
      super();
      this.device = new Device();

      this.signalrSubscription.push(
         subscribeEvent(connection, RESPONSE_CONSUMER_CREATED, this.onNewConsumer.bind(this)),
         subscribeEvent(connection, RESPONSE_CONSUMER_CLOSED, this.onConsumerClosed.bind(this)),
         subscribeEvent(connection, RESPONSE_CONSUMER_PAUSED, this.onConsumerPaused.bind(this)),
         subscribeEvent(connection, RESPONSE_CONSUMER_RESUMED, this.onConsumerResumed.bind(this)),
         subscribeEvent(connection, RESPONSE_PRODUCER_CHANGED, this.onProducerChanged.bind(this)),
      );
   }

   public device: Device;
   public sendTransport: Transport | null = null;
   public receiveTransport: Transport | null = null;

   public canProduceVideo() {
      return this.device.canProduce('video');
   }

   public canProduceAudio() {
      return this.device.canProduce('audio');
   }

   public close(): void {
      log('Close connection');

      this.sendTransport?.close();
      this.receiveTransport?.close();

      for (const [, consumer] of this.consumers.entries()) {
         consumer.close();
      }
      this.consumers.clear();

      unsubscribeAll(this.connection, this.signalrSubscription);
   }

   public notifyDeviceEnabled(source: ProducerSource) {
      this.emit('onDeviceEnabled', source);
   }

   private async onNewConsumer(payload: OnNewConsumerPayload) {
      if (!this.receiveTransport) {
         log('[Consumer: %s] Received new consumer, but receive transport is not initialized, cache', payload.id);
         this.pendingConsumers.push(payload);
         return;
      }

      log('[Consumer: %s] Received new consumer event, initialize', payload.id);
      await this.initNewConsumer(payload, this.receiveTransport);
   }

   private async initNewConsumer(
      { id, producerId, kind, rtpParameters, appData, participantId }: OnNewConsumerPayload,
      transport: Transport,
   ): Promise<void> {
      log('[Consumer: %s] Begin initializing consumer...', id);

      try {
         const processId = this.joiningConsumersId++;
         this.joiningConsumers.set(id, processId);

         const consumer = await transport.consume({
            id,
            rtpParameters,
            kind,
            producerId,
            appData: { ...appData, participantId },
         });

         if (this.joiningConsumers.get(id) !== processId) {
            consumer.close();
            log('[Consumer: %s] detected race condition, consumer was closed while creating, delete consumer', id);
            return;
         } else {
            this.joiningConsumers.delete(id);
         }

         this.consumers.set(id, consumer);
         log('[Consumer: %s] Consumer initialized successfully', id);

         this.emit('newConsumer', consumer);
      } catch (error) {
         log('[Consumer: %s] Error on initializing consumer %O', id, error);
      }
   }

   private onConsumerClosed({ consumerId }: ConsumerInfoPayload) {
      const consumer = this.consumers.get(consumerId);
      this.joiningConsumers.delete(consumerId);

      if (consumer) {
         consumer.close();

         this.consumers.delete(consumerId);
         log('[Consumer: %s] Removed', consumerId);
      } else {
         log('[Consumer: %s] Received consumer closed event, but consumer was not found', consumerId);
      }
   }

   private onConsumerPaused({ consumerId }: ConsumerInfoPayload) {
      const consumer = this.consumers.get(consumerId);
      if (consumer) {
         consumer.pause();

         log('[Consumer: %s] Paused', consumerId);
      } else {
         log('[Consumer: %s] Received consumer paused event, but consumer was not found', consumerId);
      }
   }

   private onConsumerResumed({ consumerId }: ConsumerInfoPayload) {
      const consumer = this.consumers.get(consumerId);
      if (consumer) {
         consumer.resume();

         log('[Consumer: %s] Resumed', consumerId);
      } else {
         log('[Consumer: %s] Received consumer resumed event, but consumer was not found', consumerId);
      }
   }

   private onProducerChanged(args: ProducerChangedEventArgs) {
      this.emit('onProducerChanged', args);
   }

   public async createSendTransport(): Promise<Transport> {
      const transportOptions = await this.client.createTransport({
         sctpCapabilities: this.device.sctpCapabilities,
         producing: true,
         consuming: false,
      });

      if (!transportOptions.success) {
         log('Error creating send transport: ', transportOptions.error);
         throw new Error('Error creating send transport.');
      }

      log('Created send transport successfully, initialize now...');

      const transport = this.device.createSendTransport({
         ...transportOptions.response,
         iceServers: [],
         proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
      });

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
         log('[Transport: %s] Attempt to connect local transport...', transport.id);

         this.client
            .connectTransport({ transportId: transport.id, dtlsParameters })
            .then((response) => {
               log('[Transport: %s] Remote transport connection response, success: %s', transport.id, response.success);

               if (response.success) callback();
               else errback();
            })
            .catch((err) => {
               log('[Transport: %s] Remote transport connection failed: %O', transport.id, err);
               errback();
            });
      });

      transport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
         try {
            log('[Transport: %s] Local transport send attempt to produce...', transport.id);
            const result = await this.client.transportProduce({
               transportId: transport.id,
               kind,
               rtpParameters,
               appData,
            });

            if (result.success) {
               log('[Transport: %s] Response was successful, producer id: %s', transport.id, result.response.id);
               callback({ id: result.response.id });
            } else {
               log('[Transport: %s] Response failure: %O', transport.id, result.error);
               errback(result.error);
            }
         } catch (error) {
            log('[Transport: %s] Request failure: %O', transport.id, error);
            errback(error);
         }
      });

      this.sendTransport = transport;
      return transport;
   }

   public async createReceiveTransport(): Promise<Transport> {
      this.pendingConsumers = [];

      const transportOptions = await this.client.createTransport({
         producing: false,
         consuming: true,
      });

      if (!transportOptions.success) {
         console.error('Error creating receive transport: ', transportOptions.error);
         throw new Error('Error creating receive transport.');
      }

      const transport = this.device.createRecvTransport(transportOptions.response);

      transport.on('connect', ({ dtlsParameters }, callback, errback) => {
         log('[Transport: %s] Attempt to connect local receive transport...', transport.id);

         this.client
            .connectTransport({ transportId: transport.id, dtlsParameters })
            .then((response) => {
               log(
                  '[Transport: %s] Remote receive transport connection response, success: %s',
                  transport.id,
                  response.success,
               );

               if (response.success) callback();
               else errback(response.error);
            })
            .catch((err) => {
               log('[Transport: %s] Remote receive transport connection failed: %O', transport.id, err);
               errback();
            });
      });

      this.receiveTransport = transport;

      log('Receive transport created successfully, process %d pending consumers...', this.pendingConsumers.length);

      for (const payload of this.pendingConsumers) {
         await this.initNewConsumer(payload, transport);
      }

      return transport;
   }

   public async changeStream(request: ChangeStreamRequest): Promise<void> {
      const result = await this.client.changeStream(request);
      if (!result.success) {
         log('Change stream %O failure: %O', request, result.error);
         throw result.error;
      }
   }
}
