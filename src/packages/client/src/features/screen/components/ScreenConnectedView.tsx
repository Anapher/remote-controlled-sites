import { useQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import useQueryClientUpdateScreen from '../../../hooks/useScreenInfo';
import { fetchScreen } from '../../../services/screen';
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
   const { data: screen, isFetching } = useQuery({
      queryKey: ['screen', id],
      queryFn: () => fetchScreen({ token, screenName: id }),
   });

   useQueryClientUpdateScreen(id, socket);

   if (!screen || isFetching) return <ConnectingView />;
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
