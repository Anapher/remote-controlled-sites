import {
   ConsumerLayers,
   ConsumerScore,
   ConsumerType,
   MediaKind,
   ProducerScore,
   RtpParameters,
} from 'mediasoup/node/lib/types';

export const producerSources = ['webcam', 'screen'] as const;

export type ProducerSource = typeof producerSources[number];

export type ProducerChangedEventArgs = {
   source: ProducerSource;
   action: 'pause' | 'resume' | 'close';
   producerId: string;
};

export type ConsumerArgs = {
   consumerId: string;
};

export type ConsumerCreatedArgs = {
   participantId: string;
   producerId: string;
   id: string;
   kind: MediaKind;
   rtpParameters: RtpParameters;
   type: ConsumerType;
   appData: any;
   producerPaused: boolean;
};

export type ConsumerScoreArgs = ConsumerArgs & { score: ConsumerScore };
export type ConsumerLayersChanged = ConsumerArgs & {
   layers: ConsumerLayers;
};

export type ProducerScoreInfo = {
   producerId: string;
   score: ProducerScore[];
};

export type ConsumerInfo = {
   paused: boolean;
   participantId: string;
   source: ProducerSource;
};

export type ProducerInfo = {
   paused: boolean;
};
