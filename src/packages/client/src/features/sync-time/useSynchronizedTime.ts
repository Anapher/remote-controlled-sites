import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export default function useSynchronizedTime() {
   const { loading, offset } = useSelector((state: RootState) => state.syncTime);

   return { loading, error: !loading && !offset, getSyncedTime: () => new Date().getTime() + (offset || 0) };
}
