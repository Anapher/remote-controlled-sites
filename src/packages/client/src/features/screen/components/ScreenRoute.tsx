import { useParams } from 'react-router-dom';
import ScreenView from './ScreenView';

export default function ScreenRoute() {
   const params = useParams();

   return <ScreenView id={params.screenId as string} />;
}
