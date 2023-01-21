import Player from '../../../components/TypedVideoPlayer';
import { ScreenControlledVideo } from '../../../shared/Screen';

type Props = {
   current: ScreenControlledVideo;
   onChange: (dto: ScreenControlledVideo) => void;
};

export default function ShareVideoActionsPlayer({ current, onChange }: Props) {
   const handleOnPlay = () => {
      onChange({ ...current, paused: false });
   };

   const handleOnPause = () => {
      onChange({ ...current, paused: true });
   };

   return <Player url={current.url} controls onPlay={handleOnPlay} onPause={handleOnPause} />;
}
