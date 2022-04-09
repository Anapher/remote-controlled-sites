import React, { useEffect, useMemo, useState } from 'react';
import useAdminWs from '../../../app/useAdminWs';
import ErrorScreen from '../../../components/ErrorScreen';
import Loading from '../../../components/Loading';
import useAuthToken from '../../../hooks/useAuthToken';
import { authAsAdmin } from '../../../services/auth';
import AuthorizedIndex from './AuthorizedIndex';

export default function AdminIndex() {
   const [password, setPassword] = useState<string | null>(null);
   const authFn = useMemo(() => (password ? () => authAsAdmin(password) : null), [password]);
   const token = useAuthToken(authFn);

   const { socket, connected, connectionError } = useAdminWs(token);

   useEffect(() => {
      const pw = prompt('Bitte geben Sie das Passwort ein');
      setPassword(pw);
   }, []);

   if (connectionError) return <ErrorScreen message="Ein Verbindungsfehler ist aufgetreten" />;

   if (!connected || !socket) return <Loading message="Verbinde..." />;

   return <AuthorizedIndex socket={socket} />;
}
