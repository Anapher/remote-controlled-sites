import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { fetchScreen } from '../services/screen';
import { ScreenInfo } from '../shared/Screen';
import { SCREEN_UPDATED } from '../shared/ws-server-messages';

export default function useScreenInfo(screenName: string, token: string, socket: Socket) {
   const [screen, setScreen] = useState<ScreenInfo | null>(null);

   useEffect(() => {
      setScreen(null);

      (async () => {
         const screen = await fetchScreen(token, screenName);
         // dont overwrite if a screen was received by the websocket, as that will be more recent
         setScreen((x) => x || screen);
      })();

      const screenUpdateHandler = (screen: ScreenInfo) => {
         if (screen.name === screenName) {
            setScreen(screen);
         }
      };

      socket.on(SCREEN_UPDATED, screenUpdateHandler);

      return () => {
         socket.off(SCREEN_UPDATED, screenUpdateHandler);
      };
   }, [socket, token, screenName]);

   return screen;
}
