import { useEffect, useState } from 'react';

export default function useAuthToken(authFn?: (() => Promise<string>) | null) {
   const [token, setToken] = useState<string | null>();

   useEffect(() => {
      if (!authFn) return;

      let disposed = false;

      (async () => {
         const token = await authFn();
         if (disposed) return;

         setToken(token);
      })();

      return () => {
         disposed = true;
      };
   }, [authFn]);

   return token;
}
