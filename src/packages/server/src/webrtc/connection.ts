import { Consumer, Producer, RtpCapabilities, SctpCapabilities, Transport } from 'mediasoup/node/lib/types';

export default class Connection {
   constructor(public id: string) {}

   public initializedInfo: { rtpCapabilities: RtpCapabilities; sctpCapabilities: SctpCapabilities } | null = null;

   public receiveTransport: Transport | null = null;
   public sendTransport: Transport | null = null;

   public producers: Map<string, Producer> = new Map();
   public consumers: Map<string, Consumer> = new Map();
   public transports: Map<string, Transport> = new Map();
}
