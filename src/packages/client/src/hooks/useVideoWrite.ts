import { useEffect, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';

export default function useVideoWrite(
   current: ScreenControlledVideo,
   onChange: (dto: ScreenControlledVideo) => void,
   readonly: boolean,
): [Partial<ReactPlayerProps>, boolean] {
   const latestStatus = useRef(current);
   const player = useRef<ReactPlayer>(null);
   const [isOutOfSync, setIsOutOfSync] = useState(false);

   useEffect(() => {
      latestStatus.current = current;
   }, [current]);

   const handleChange = (patch: Partial<ScreenControlledVideo>) => {
      if (readonly) return;

      // desync support, if continues updates come up without 'current' updating, build upon the latest state
      const updated = { ...latestStatus.current, ...patch };
      onChange(updated);
      latestStatus.current = updated;
   };

   const handleOnPlay = () => {
      handleChange({ paused: false });
   };

   const handleOnPause = () => {
      handleChange({ paused: true });
   };

   const handleOnProgress = (args: OnProgressProps) => {
      const startPosition = Math.round(new Date().getTime() - args.playedSeconds * 1000);
      const isOutOfSync = Math.abs(current.startPosition - startPosition) > TOLERATED_POSITION_DIFF;

      setIsOutOfSync(isOutOfSync);

      if (readonly) {
         if (current.paused) return;

         if (isOutOfSync) {
            player.current?.seekTo((new Date().getTime() - current.startPosition) / 1000, 'seconds');
         }
      } else {
         if (isOutOfSync) {
            handleChange({ startPosition });
         }
      }
   };

   useEffect(() => {
      if (readonly) {
         player.current?.seekTo((new Date().getTime() - current.startPosition) / 1000, 'seconds');
      }
   }, [current.startPosition, readonly]);

   return [
      {
         ref: player,
         url: current.url,
         onPlay: handleOnPlay,
         onPause: handleOnPause,
         onProgress: handleOnProgress,
         playing: !current.paused,
      },
      isOutOfSync,
   ];
}
