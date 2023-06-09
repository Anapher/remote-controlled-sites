import { Express, RequestHandler } from 'express';
import { authenticateToken, AuthUserInfo } from '../auth';
import Room from '../webrtc/room';
import WebRtcManager from '../webrtc/webrtc-manager';
import { asyncHandler } from '../utils/express-utils';

const checkRoom: (manager: WebRtcManager) => RequestHandler = (manager) =>
   asyncHandler(async (req, res, next) => {
      const user = (req as any).user as AuthUserInfo;
      const room = await manager.getRoomOfUser(user.id);

      if (!room) {
         res.sendStatus(401);
         return;
      }

      (req as any).room = room;
      next();
   });

export default function configureApi(app: Express, manager: WebRtcManager) {
   app.get('/api/webrtc/router-capabilities', authenticateToken, checkRoom(manager), (req, res) => {
      const room = (req as any).room as Room;

      const result = room.routerCapabilities;
      res.json(result);
   });

   app.post(
      '/api/webrtc/initialize-connection',
      authenticateToken,
      checkRoom(manager),
      asyncHandler(async (req, res) => {
         const room = (req as any).room as Room;
         const user = (req as any).user as AuthUserInfo;

         const result = room.initializeConnection(req.body, user.id);
         res.json(result);
      }),
   );

   app.post(
      '/api/webrtc/create-transport',
      authenticateToken,
      checkRoom(manager),
      asyncHandler(async (req, res) => {
         const room = (req as any).room as Room;
         const user = (req as any).user as AuthUserInfo;

         const result = await room.createTransport(req.body, user.id);
         res.json(result);
      }),
   );

   app.post(
      '/api/webrtc/connect-transport',
      authenticateToken,
      checkRoom(manager),
      asyncHandler(async (req, res) => {
         const room = (req as any).room as Room;
         const user = (req as any).user as AuthUserInfo;

         const result = await room.connectTransport(req.body, user.id);
         res.json(result);
      }),
   );

   app.post(
      '/api/webrtc/transport-produce',
      authenticateToken,
      checkRoom(manager),
      asyncHandler(async (req, res) => {
         const room = (req as any).room as Room;
         const user = (req as any).user as AuthUserInfo;

         const result = await room.transportProduce(req.body, user.id);
         res.json(result);
      }),
   );
}
