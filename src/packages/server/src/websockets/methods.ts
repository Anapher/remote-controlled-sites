import { Server } from 'socket.io';
import { getScreen } from '../database';
import {
   JoinRoomRequest,
   REQUEST_JOIN_ROOM,
   REQUEST_LEAVE_ROOM,
   RESPONSE_ROOM_JOINED,
} from '../shared/ws-server-messages';
import WebRtcManager from '../webrtc/webrtc-manager';
import { ADMIN_ROOM_NAME, ConnectionRoomName } from './consts';

export default function registerMethods(io: Server, manager: WebRtcManager) {
   io.on('connection', (socket) => {
      console.log('a user connected');
      const userId = socket.data.id as string;

      socket.join(ConnectionRoomName(userId));

      if (socket.data.admin) {
         console.log('listen for admin events');
         socket.join(ADMIN_ROOM_NAME);
      }

      socket.on('disconnect', async () => {
         console.log('Client disconnected');

         const room = socket.data.joinedRoom;
         if (room) {
            await manager.leaveRoom(userId);
         }
      });

      socket.on(REQUEST_JOIN_ROOM, async (req: JoinRoomRequest) => {
         if (socket.data.joinedRoom) return;

         const screen = await getScreen(req.screenName);
         if (!screen) {
            console.log('Screen does not exist');
            return;
         }

         socket.data.joinedRoom = screen.name;
         await manager.joinRoom(screen.name, userId);

         socket.emit(RESPONSE_ROOM_JOINED);
      });

      socket.on(REQUEST_LEAVE_ROOM, async () => {
         await manager.leaveRoom(userId);
         socket.data.joinedRoom = undefined;
      });
   });
}
