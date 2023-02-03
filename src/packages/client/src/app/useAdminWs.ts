import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ScreenInfo } from '../shared/Screen';
import { RESPONSE_ALL_SCREENS, ScreensResponse, SCREEN_UPDATED } from '../shared/ws-server-messages';

export default function useAdminWs(token?: string | null): {
   socket: Socket | null;
   connected: boolean;
   connectionError: boolean;
} {
   const queryClient = useQueryClient();
   const [socket, setSocket] = useState<Socket | null>(null);
   const [connected, setConnected] = useState(false);
   const [connectionError, setConnectionError] = useState<boolean>(false);

   useEffect(() => {
      if (!token) return;

      console.log('try to connect admin socket');

      const sock = io({ auth: { token } });

      const allScreensHandler = (data: ScreensResponse) => {
         queryClient.setQueryData(['all_screens'], data);
      };

      const updateScreenHandler = (data: ScreenInfo) => {
         queryClient.setQueryData<ScreensResponse>(['all_screens'], (previous) => {
            if (!previous) {
               return { screens: [data] };
            }

            return { screens: previous.screens.map((x) => (x.name !== data.name ? x : data)) };
         });
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
   }, [token, queryClient]);

   return { socket, connected, connectionError };
}
