import { useEffect, useRef } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';

export default function useVideoReadOnly(content: ScreenControlledVideo): Partial<ReactPlayerProps> {
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

   return {
      url: content.url,
      playing: !content.paused,
      onProgress: handleOnProgress,
      ref: player,
   };
}
