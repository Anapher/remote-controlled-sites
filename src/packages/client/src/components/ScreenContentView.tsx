import { useQuery } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import useAuthSocket from '../hooks/useAuthSocket';
import useAuthToken from '../hooks/useAuthToken';
import useQueryClientUpdateScreen from '../hooks/useScreenInfo';
import { authAsUser } from '../services/auth';
import { fetchScreen } from '../services/screen';
import { ScreenInfo } from '../shared/Screen';
import ConnectingView from './ConnectingView';

type Props = {
   id: string;
   render: (props: { screen: ScreenInfo; token: string; socket: Socket }) => JSX.Element;
};

export default function ScreenContentView({ id, render }: Props) {
   const token = useAuthToken(authAsUser);
   const socket = useAuthSocket(token);

   const { data } = useQuery({
      queryKey: ['screen', id],
      queryFn: () => fetchScreen({ screenName: id }),
      refetchOnWindowFocus: false,
   });

   useQueryClientUpdateScreen(id, socket);

   if (!data || !token || !socket) return <ConnectingView />;

   return render({ screen: data, token, socket });
}
