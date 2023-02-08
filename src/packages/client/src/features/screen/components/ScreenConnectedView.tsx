import { Socket } from 'socket.io-client';
import { ScreenInfo } from '../../../shared/Screen';
import ScreenControlledVideoContent from './ScreenControlledVideoContent';
import ScreenShareScreenContent from './ScreenShareScreenContent';
import UrlScreenContent from './UrlScreenContent';
import VideoGridContent from './VideoGridContent';

type Props = {
   socket: Socket;
   token: string;
   screen: ScreenInfo;
};

export default function ScreenConnectedView({ screen, token, socket }: Props) {
   if (!screen.content) return <VideoGridContent screen={screen} token={token} />;

   switch (screen.content.type) {
      case 'url':
         return <UrlScreenContent content={screen.content} />;
      case 'screenshare':
         return <ScreenShareScreenContent screenName={screen.name} socket={socket} token={token} />;
      case 'controlled-video':
         return <ScreenControlledVideoContent content={screen.content} screenName={screen.name} token={token} />;
      default:
         return null;
   }
}
