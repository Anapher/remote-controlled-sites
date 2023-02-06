import { Socket } from 'socket.io-client';
import { ScreenInfo } from '../../../shared/Screen';
import NoContent from './NoContent';
import ScreenControlledVideoContent from './ScreenControlledVideoContent';
import ScreenShareScreenContent from './ScreenShareScreenContent';
import UrlScreenContent from './UrlScreenContent';

type Props = {
   socket: Socket;
   token: string;
   screen: ScreenInfo;
};

export default function ScreenConnectedView({ screen, token, socket }: Props) {
   if (!screen.content) return <NoContent />;

   switch (screen.content.type) {
      case 'url':
         return <UrlScreenContent content={screen.content} />;
      case 'screenshare':
         return <ScreenShareScreenContent screenName={screen.name} socket={socket} token={token} />;
      case 'controlled-video':
         return <ScreenControlledVideoContent content={screen.content} />;
      default:
         return null;
   }
}
