import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useAuthSocket(token?: string | null) {
   const [socket, setSocket] = useState<Socket | null>(null);

   useEffect(() => {
      if (!token) {
         setSocket(null);
         return;
      }
      const socket = io({ auth: { token } });
      setSocket(socket);

      return () => {
         socket.disconnect();
      };
   }, [token]);

   return socket;
}
