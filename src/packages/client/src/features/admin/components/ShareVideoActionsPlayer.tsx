import useVideoWrite from '../../../hooks/useVideoWrite';
import { ScreenControlledVideo } from '../../../shared/Screen';
import Player from '../../../components/TypedVideoPlayer';

type Props = {
   current: ScreenControlledVideo;
   onChange: (dto: ScreenControlledVideo) => void;
};

export default function ShareVideoActionsPlayer({ current, onChange }: Props) {
   const [props] = useVideoWrite(current, onChange, false);
   return <Player {...props} controls={true} />;
}
