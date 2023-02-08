import SyncVideo from '../../../components/SyncVideo';
import { ScreenControlledVideo } from '../../../shared/Screen';

type Props = {
   current: ScreenControlledVideo;
   onChange: (dto: ScreenControlledVideo) => void;
};

export default function ShareVideoActionsPlayer({ current, onChange }: Props) {
   return <SyncVideo current={current} onChange={onChange} />;
}
