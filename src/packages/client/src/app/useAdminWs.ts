import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
   REQUEST_ALL_SCREENS,
   REQUEST_DEL_SCREEN,
   REQUEST_PUT_SCREEN,
   RESPONSE_ALL_SCREENS,
   ScreensResponse,
   SCREEN_UPDATED,
} from '../shared/ws-server-messages';
import { io, Socket } from 'socket.io-client';
import { setScreen, setScreens } from '../features/admin/slice';
import { ScreenDto, ScreenInfo } from '../shared/Screen';

export default function useAdminWs(token?: string | null): {
   socket: Socket | null;
   connected: boolean;
   connectionError: boolean;
} {
   const dispatch = useDispatch();
   const [socket, setSocket] = useState<Socket | null>(null);
   const [connected, setConnected] = useState(false);
   const [connectionError, setConnectionError] = useState<boolean>(false);

   useEffect(() => {
      if (!token) return;

      console.log('try to connect admin socket');

      const sock = io({ auth: { token } });

      const allScreensHandler = (data: ScreensResponse) => {
         dispatch(setScreens(data.screens));
      };

      const updateScreenHandler = (data: ScreenInfo) => {
         dispatch(setScreen(data));
      };

      const connectedHandler = () => {
         setConnected(true);
      };

      const disconnectedHandler = () => {
         setConnected(false);
      };

      const connectionErrorHandler = () => {
         setConnectionError(true);
         setConnected(false);
      };

      sock.on(RESPONSE_ALL_SCREENS, allScreensHandler);
      sock.on(SCREEN_UPDATED, updateScreenHandler);

      sock.io.on('open', connectedHandler);
      sock.io.on('close', disconnectedHandler);
      sock.io.on('close', connectionErrorHandler);

      setSocket(sock);
      setConnected(false);
      setConnectionError(false);

      return () => {
         sock.disconnect();
         sock.off(RESPONSE_ALL_SCREENS, allScreensHandler);
         sock.off(SCREEN_UPDATED, updateScreenHandler);
         sock.io.off('open', connectedHandler);
         sock.io.off('close', disconnectedHandler);
         sock.io.off('close', connectionErrorHandler);
      };
   }, [token, dispatch]);

   return { socket, connected, connectionError };
}

export function sendRequestScreens(socket: Socket) {
   socket.emit(REQUEST_ALL_SCREENS);
}

export function sendPutScreen(socket: Socket, screen: ScreenDto) {
   socket.emit(REQUEST_PUT_SCREEN, screen);
}

export function sendDelScreen(socket: Socket, name: string) {
   socket.emit(REQUEST_DEL_SCREEN, name);
}
