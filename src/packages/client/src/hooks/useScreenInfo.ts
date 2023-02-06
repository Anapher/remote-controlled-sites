import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { ScreenInfo } from '../shared/Screen';
import { SCREEN_UPDATED } from '../shared/ws-server-messages';

export default function useQueryClientUpdateScreen(screenName: string, socket: Socket | undefined | null) {
   const queryClient = useQueryClient();

   useEffect(() => {
      if (!socket) return;

      const screenUpdateHandler = (screen: ScreenInfo) => {
         if (screen.name === screenName) {
            queryClient.setQueryData(['screen', screenName], screen);
         }
      };

      socket.on(SCREEN_UPDATED, screenUpdateHandler);

      return () => {
         socket.off(SCREEN_UPDATED, screenUpdateHandler);
      };
   }, [socket, screenName, queryClient]);
}
