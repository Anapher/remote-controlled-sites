import { Server } from 'socket.io';
import ClientMessenger from '../webrtc/client-messenger';
import {
   ProducerChangedEventArgs,
   ProducerScoreInfo,
   ConsumerArgs,
   ConsumerScoreArgs,
   ConsumerCreatedArgs,
   ConsumerLayersChanged,
} from '../webrtc/pub-types';
import { ConnectionRoomName } from './consts';
import * as msg from '../shared/ws-server-messages';

/**
 * Implementation of client messenger using socket.io
 */
export default class SocketIoClientMessenger implements ClientMessenger {
   constructor(private io: Server) {}

   async notifyProducerChanged(connectionId: string, args: ProducerChangedEventArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_PRODUCER_CHANGED, args);
   }
   async notifyProducerScore(connectionId: string, args: ProducerScoreInfo): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_PRODUCER_SCORE, args);
   }
   async notifyConsumerClosed(connectionId: string, args: ConsumerArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_CLOSED, args);
   }
   async notifyConsumerPaused(connectionId: string, args: ConsumerArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_PAUSED, args);
   }
   async notifyConsumerResumed(connectionId: string, args: ConsumerArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_RESUMED, args);
   }
   async notifyConsumerScore(connectionId: string, args: ConsumerScoreArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_SCORE, args);
   }
   async notifyConsumerCreated(connectionId: string, args: ConsumerCreatedArgs): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_CREATED, args);
   }
   async notifyConsumerLayersChanged(connectionId: string, args: ConsumerLayersChanged): Promise<void> {
      this.io.to(ConnectionRoomName(connectionId)).emit(msg.RESPONSE_CONSUMER_LAYERS_CHANGED, args);
   }
}
