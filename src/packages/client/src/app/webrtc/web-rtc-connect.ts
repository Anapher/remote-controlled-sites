import debug from 'debug';
import { Socket } from 'socket.io-client';
import { JoinRoomRequest, REQUEST_JOIN_ROOM, RESPONSE_ROOM_JOINED } from '../../shared/ws-server-messages';
import { RestClientWebRtc } from './types';
import { WebRtcConnection } from './WebRtcConnection';

const log = debug('webrtc:createConnectionSend');

export default async function connectWebRtc(
   screenName: string,
   rest: RestClientWebRtc,
   socket: Socket,
): Promise<WebRtcConnection> {
   const req: JoinRoomRequest = { screenName };
   socket.emit(REQUEST_JOIN_ROOM, req);

   await new Promise((resolve) => {
      socket.once(RESPONSE_ROOM_JOINED, resolve);
   });

   console.log('Joined room');

   const connection = new WebRtcConnection(socket, rest);
   const device = connection.device;

   const rtpResult = await rest.getRouterCapabilities();
   if (!rtpResult?.success) throw new Error('Router capabilities could not be retrived from server.');
   log('Received router capabilities %O', rtpResult);

   console.log(rtpResult);

   await device.load({ routerRtpCapabilities: rtpResult.response });

   console.log('Loaded router capabilities');

   const result = await rest.initializeConnection({
      sctpCapabilities: device.sctpCapabilities,
      rtpCapabilities: device.rtpCapabilities,
   });

   if (!result.success) {
      throw new Error('Initialize connection failed, empty result.');
   }

   log('Initialized device');

   return connection;
}
