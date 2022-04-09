import useAuthSocket from '../../../hooks/useAuthSocket';
import useAuthToken from '../../../hooks/useAuthToken';
import { authAsUser } from '../../../services/auth';
import ConnectingView from './ConnectingView';
import ScreenConnectedView from './ScreenConnectedView';

type Props = {
   id: string;
};

export default function ScreenView({ id }: Props) {
   const token = useAuthToken(authAsUser);
   const socket = useAuthSocket(token);

   console.log(token);

   if (!socket || !token) return <ConnectingView />;

   return <ScreenConnectedView id={id} token={token} socket={socket} />;
}
