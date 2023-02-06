import { useParams } from 'react-router-dom';
import ScreenContentView from '../../../components/ScreenContentView';
import ScreenControl from './ScreenControl';

export default function ScreenRoute() {
   const params = useParams();
   const id = params.screenId as string;

   return <ScreenContentView id={id} render={(props) => <ScreenControl {...props} />} />;
}
