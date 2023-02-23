import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hadUserInteraction } from '../slice';

export default function UserInteractionListener() {
   const dispatch = useDispatch();

   useEffect(() => {
      const events = ['scroll', 'keydown', 'click', 'touchstart'];

      const handleUserInteraction = () => {
         dispatch(hadUserInteraction());

         for (const event of events) {
            document.body.removeEventListener(event, handleUserInteraction);
         }
      };

      for (const event of events) {
         document.body.addEventListener(event, handleUserInteraction, { once: true });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return null;
}
