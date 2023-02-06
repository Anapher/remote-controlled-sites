import ScreenContentView from '../../../components/ScreenContentView';
import ScreenConnectedView from './ScreenConnectedView';

type Props = {
   id: string;
};

export default function ScreenView({ id }: Props) {
   return <ScreenContentView id={id} render={(props) => <ScreenConnectedView {...props} />} />;
}
