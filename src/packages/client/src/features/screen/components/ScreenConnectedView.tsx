import { Socket } from 'socket.io-client';
import useScreenInfo from '../../../hooks/useScreenInfo';
import ConnectingView from './ConnectingView';
import NoContent from './NoContent';
import ScreenControlledVideoContent from './ScreenControlledVideoContent';
import ScreenShareScreenContent from './ScreenShareScreenContent';
import UrlScreenContent from './UrlScreenContent';

type Props = {
   id: string;
   socket: Socket;
   token: string;
};

export default function ScreenConnectedView({ id, token, socket }: Props) {
   const screen = useScreenInfo(id, token, socket);

   if (!screen) return <ConnectingView />;

   console.log(screen);

   if (!screen.content) return <NoContent />;

   switch (screen.content.type) {
      case 'url':
         return <UrlScreenContent content={screen.content} />;
      case 'screenshare':
         return <ScreenShareScreenContent screenName={id} socket={socket} token={token} />;
      case 'controlled-video':
         return <ScreenControlledVideoContent content={screen.content} />;
      default:
         return null;
   }
}
