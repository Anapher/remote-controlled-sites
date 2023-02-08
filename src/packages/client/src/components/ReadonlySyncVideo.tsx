import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';
import Player from './TypedVideoPlayer';

type Props = {
   content: ScreenControlledVideo;
};

export default function ReadonlySyncVideo({ content }: Props) {
   const player = useRef<ReactPlayer>(null);

   const handleOnProgress = (args: OnProgressProps) => {
      if (content.paused) return;

      const startPosition = Math.round(new Date().getTime() - args.playedSeconds * 1000);

      if (Math.abs(content.startPosition - startPosition) > TOLERATED_POSITION_DIFF) {
         player.current?.seekTo((new Date().getTime() - content.startPosition) / 1000, 'seconds');
      }
   };

   useEffect(() => {
      player.current?.seekTo((new Date().getTime() - content.startPosition) / 1000, 'seconds');
   }, [content.startPosition]);

   return (
      <Player
         url={content.url}
         height="100%"
         width="100%"
         playing={!content.paused}
         onProgress={handleOnProgress}
         muted
         ref={player}
      />
   );
}
