import { useEffect, useRef } from 'react';
import { ReactPlayerProps } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';

export default function useVideoWrite(
   current: ScreenControlledVideo,
   onChange: (dto: ScreenControlledVideo) => void,
): Partial<ReactPlayerProps> {
   const latestStatus = useRef(current);

   useEffect(() => {
      latestStatus.current = current;
   }, [current]);

   const handleChange = (patch: Partial<ScreenControlledVideo>) => {
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

      if (Math.abs(current.startPosition - startPosition) > TOLERATED_POSITION_DIFF) {
         handleChange({ startPosition });
      }
   };

   return {
      url: current.url,
      onPlay: handleOnPlay,
      onPause: handleOnPause,
      onProgress: handleOnProgress,
   };
}
