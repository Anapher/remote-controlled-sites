import { Server } from 'socket.io';
import { verifyToken } from '../auth';
import WebRtcManager from '../webrtc/webrtc-manager';
import registerMethods from './methods';

/**
 * Configure websockets on the express server
 * @param app the express reference
 */
export default function configureWebSockets(io: Server, manager: WebRtcManager) {
   // add authentication middleware and verify the token
   io.use(async (socket, next) => {
      console.log('client connecting');

      const token = socket.handshake.auth.token as string;

      try {
         const user = await verifyToken(token);

         socket.data.id = user.id;
         socket.data.admin = user.admin;
      } catch (error) {
         next(new Error('Invalid token'));
         return;
      }

      next();
   });

   registerMethods(io, manager);
}
