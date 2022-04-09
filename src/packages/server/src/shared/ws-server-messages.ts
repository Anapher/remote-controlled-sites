import { ScreenInfo } from './Screen';
import { SctpCapabilities, RtpCapabilities } from 'mediasoup/node/lib/types';

export const REQUEST_ALL_SCREENS = 'GET_SCREENS';
export const REQUEST_PUT_SCREEN = 'PUT_SCREEN';
export const REQUEST_DEL_SCREEN = 'DEL_SCREEN';

export const REQUEST_JOIN_ROOM = 'JOIN_ROOM';

export const RESPONSE_ALL_SCREENS = 'RETURN_SCREENS';
export const SCREEN_UPDATED = 'SCREEN_UPDATED';

export const RESPONSE_PRODUCER_CHANGED = 'RESPONSE_PRODUCER_CHANGED';
export const RESPONSE_PRODUCER_SCORE = 'RESPONSE_PRODUCER_SCORE';
export const RESPONSE_CONSUMER_CLOSED = 'RESPONSE_CONSUMER_CLOSED';
export const RESPONSE_CONSUMER_PAUSED = 'RESPONSE_CONSUMER_PAUSED';
export const RESPONSE_CONSUMER_RESUMED = 'RESPONSE_CONSUMER_RESUMED';
export const RESPONSE_CONSUMER_SCORE = 'RESPONSE_CONSUMER_SCORE';
export const RESPONSE_CONSUMER_CREATED = 'RESPONSE_CONSUMER_CREATED';
export const RESPONSE_CONSUMER_LAYERS_CHANGED = 'RESPONSE_CONSUMER_LAYERS_CHANGED';

export type ScreensResponse = {
   screens: ScreenInfo[];
};

export type JoinRoomRequest = {
   screenName: string;
   sctpCapabilities: SctpCapabilities;
   rtpCapabilities: RtpCapabilities;
};
