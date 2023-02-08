import React, { useEffect, useRef } from 'react';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';
import Player from './TypedVideoPlayer';

type Props = {
   current: ScreenControlledVideo;
   onChange: (dto: ScreenControlledVideo) => void;
   fullscreen?: boolean;
};

export default function SyncVideo({ current, onChange, fullscreen }: Props) {
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

   return (
      <Player
         width={fullscreen ? '100%' : undefined}
         height={fullscreen ? '100%' : undefined}
         url={current.url}
         controls
         onPlay={handleOnPlay}
         onPause={handleOnPause}
         onProgress={handleOnProgress}
      />
   );
}
