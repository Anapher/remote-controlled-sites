import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import useAdminWs from '../../../app/useAdminWs';
import ErrorScreen from '../../../components/ErrorScreen';
import Loading from '../../../components/Loading';
import AuthorizedIndex from './AuthorizedIndex';
import Login from './Login';

export default function AdminIndex() {
   const token = useSelector((state: RootState) => state.admin.authToken);

   const { socket, connected, connectionError } = useAdminWs(token);

   if (!token) return <Login />;

   if (connectionError) return <ErrorScreen message="Ein Verbindungsfehler ist aufgetreten" />;
   if (!connected || !socket || !token) return <Loading message="Verbinde..." />;

   return <AuthorizedIndex socket={socket} />;
}
