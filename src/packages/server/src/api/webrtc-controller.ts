import { Express, RequestHandler } from 'express';
import { authenticateToken, AuthUserInfo } from '../auth';
import Room from '../webrtc/room';
import WebRtcManager from '../webrtc/webrtc-manager';

const checkRoom: (manager: WebRtcManager) => RequestHandler = (manager) => async (req, res, next) => {
   const user = (req as any).user as AuthUserInfo;
   const room = await manager.getRoomOfUser(user.id);

   if (!room) {
      res.sendStatus(401);
      return;
   }

   (req as any).room = room;
   next();
};

export default function configureApi(app: Express, manager: WebRtcManager) {
   app.post('/api/webrtc/create-transport', authenticateToken, checkRoom(manager), async (req, res) => {
      const room = (req as any).room as Room;
      const user = (req as any).user as AuthUserInfo;

      const result = await room.createTransport(req.body, user.id);
      res.json(result);
   });

   app.post('/api/webrtc/connect-transport', authenticateToken, checkRoom(manager), async (req, res) => {
      const room = (req as any).room as Room;
      const user = (req as any).user as AuthUserInfo;

      const result = await room.connectTransport(req.body, user.id);
      res.json(result);
   });

   app.post('/api/webrtc/transport-produce', authenticateToken, checkRoom(manager), async (req, res) => {
      const room = (req as any).room as Room;
      const user = (req as any).user as AuthUserInfo;

      const result = await room.transportProduce(req.body, user.id);
      res.json(result);
   });
}
