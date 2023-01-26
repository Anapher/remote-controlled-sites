import { OnProgressProps } from 'react-player/base';
import Player from '../../../components/TypedVideoPlayer';
import { TOLERATED_POSITION_DIFF } from '../../../config';
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

   const handleOnProgress = (args: OnProgressProps) => {
      const startPosition = Math.round(new Date().getTime() - args.playedSeconds * 1000);

      if (Math.abs(current.startPosition - startPosition) > TOLERATED_POSITION_DIFF) {
         onChange({ ...current, startPosition });
      }
   };

   return (
      <Player url={current.url} controls onPlay={handleOnPlay} onPause={handleOnPause} onProgress={handleOnProgress} />
   );
}
