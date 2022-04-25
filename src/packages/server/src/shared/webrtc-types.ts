import {
   DtlsParameters,
   IceParameters,
   SctpCapabilities,
   SctpParameters,
   MediaKind,
   RtpCapabilities,
   RtpParameters,
} from 'mediasoup/node/lib/types';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';

export type ConsumerLayers = {
   /**
    * The spatial layer index (from 0 to N).
    */
   spatialLayer: number;

   /**
    * The temporal layer index (from 0 to N).
    */
   temporalLayer?: number;
};

export type ProducerDevice = 'mic' | 'webcam' | 'screen' | 'sys-audio';
export type ProducerSource = ProducerDevice;

export const ProducerDevices: ProducerDevice[] = ['mic', 'webcam', 'screen'];

export function isProducerDevice(source: ProducerSource): source is ProducerDevice {
   return ProducerDevices.includes(source as any);
}

export type InitializeConnectionRequest = {
   sctpCapabilities: SctpCapabilities;
   rtpCapabilities: RtpCapabilities;
};

export type CreateTransportRequest = {
   sctpCapabilities?: SctpCapabilities;
   forceTcp?: boolean;
   producing: boolean;
   consuming: boolean;
};

export type CreateTransportResponse = {
   id: string;
   iceParameters: IceParameters;
   iceCandidates: WebRtcTransport['iceCandidates'];
   dtlsParameters: DtlsParameters;
   sctpParameters?: SctpParameters;
};

export type ConnectTransportRequest = {
   transportId: string;
   dtlsParameters: any;
};

export type TransportProduceRequest = {
   transportId: string;

   // producer options
   /**
    * Producer id (just for Router.pipeToRouter() method).
    */
   id?: string;

   /**
    * Media kind ('audio' or 'video').
    */
   kind: MediaKind;

   /**
    * RTP parameters defining what the endpoint is sending.
    */
   rtpParameters: RtpParameters;

   /**
    * Whether the producer must start in paused mode. Default false.
    */
   paused?: boolean;

   /**
    * Just for video. Time (in ms) before asking the sender for a new key frame
    * after having asked a previous one. Default 0.
    */
   keyFrameRequestDelay?: number;

   /**
    * Custom application data.
    */
   appData?: any;
};

export type TransportProduceResponse = {
   id: string;
};

export type ConsumerScore = {
   /**
    * The score of the RTP stream of the consumer.
    */
   score: number;

   /**
    * The score of the currently selected RTP stream of the producer.
    */
   producerScore: number;

   /**
    * The scores of all RTP streams in the producer ordered by encoding (just
    * useful when the producer uses simulcast).
    */
   producerScores: number[];
};
