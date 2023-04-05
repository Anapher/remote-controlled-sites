import { ScreenControlledVideo } from '../../../shared/Screen';
import Player from '../../../components/TypedVideoPlayer';
import useManagedVideo from '../../../hooks/useManagedVideo';

type Props = {
   current: ScreenControlledVideo;
   onChange: (dto: ScreenControlledVideo) => void;
};

export default function ShareVideoActionsPlayer({ current, onChange }: Props) {
   const props = useManagedVideo(current, onChange, true);
   return <Player {...props} controls={true} />;
}
