import { Consumer, Producer, RtpCapabilities, SctpCapabilities, Transport } from 'mediasoup/node/lib/types';

export default class Connection {
   constructor(public id: string, public rtpCapabilities: RtpCapabilities, public sctpCapabilities: SctpCapabilities) {}

   public receiveTransport: Transport | null = null;
   public sendTransport: Transport | null = null;

   public producers: Map<string, Producer> = new Map();
   public consumers: Map<string, Consumer> = new Map();
   public transports: Map<string, Transport> = new Map();
}
