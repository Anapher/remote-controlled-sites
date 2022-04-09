import { Socket } from 'socket.io-client';
import useScreenInfo from '../../../hooks/useScreenInfo';
import ConnectingView from './ConnectingView';
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

   if (!screen.content) return <div>Nothing to see here</div>;

   switch (screen.content.type) {
      case 'url':
         return <UrlScreenContent content={screen.content} />;
      default:
         return null;
   }
}
