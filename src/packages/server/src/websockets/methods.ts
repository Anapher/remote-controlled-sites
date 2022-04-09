import { ADMIN_ROOM_NAME, ConnectionRoomName, ScreenRoomName } from './consts';
import { Server } from 'socket.io';
import { deleteScreen, getAllScreens, getScreen, setScreen } from '../database';
import { getScreenContent, getScreenInfo } from '../screen-content-manager';
import { ScreenDto, ScreenInfo, ScreenSchema } from '../shared/Screen';
import {
   JoinRoomRequest,
   REQUEST_ALL_SCREENS,
   REQUEST_DEL_SCREEN,
   REQUEST_JOIN_ROOM,
   REQUEST_PUT_SCREEN,
   RESPONSE_ALL_SCREENS,
   ScreensResponse,
   SCREEN_UPDATED,
} from '../shared/ws-server-messages';
import WebRtcManager from '../webrtc/webrtc-manager';

export default function registerMethods(io: Server, manager: WebRtcManager) {
   const getScreenResponse = async () => {
      const screens = await getAllScreens();
      const screensWithContent = screens.map<ScreenInfo>((x) => ({
         ...x,
         content: getScreenContent(x),
      }));
      const response: ScreensResponse = { screens: screensWithContent };
      return response;
   };

   const updateScreens = async () => {
      const response = await getScreenResponse();
      io.to(ADMIN_ROOM_NAME).emit(RESPONSE_ALL_SCREENS, response);
   };

   io.on('connection', (socket) => {
      console.log('a user connected');
      const userId = socket.data.id as string;

      socket.join(ConnectionRoomName(userId));

      if (socket.data.admin) {
         console.log('listen for admin events');

         socket.on(REQUEST_ALL_SCREENS, async () => {
            socket.emit(RESPONSE_ALL_SCREENS, await getScreenResponse());
         });

         socket.on(REQUEST_PUT_SCREEN, async (screenDto: ScreenDto) => {
            console.log('put screen', screenDto);

            const result = ScreenSchema.parse(screenDto);
            await setScreen(result);
            updateScreens();

            io.emit(SCREEN_UPDATED, await getScreenInfo(screenDto.name));
         });

         socket.on(REQUEST_DEL_SCREEN, async (name: string) => {
            const result = ScreenSchema.parse({ name });
            await deleteScreen(result.name);
            updateScreens();
         });

         socket.join(ADMIN_ROOM_NAME);
      }

      socket.on('disconnect', async () => {
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

         socket.data.joinRoom = screen.name;
         await manager.joinRoom(screen.name, userId, {
            sctpCapabilities: req.sctpCapabilities,
            rtpCapabilities: req.rtpCapabilities,
         });
      });
   });
}
