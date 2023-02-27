import { RefObject, useEffect, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import { ScreenControlledVideo } from '../shared/Screen';

// The player must play once in order to be able to seek. Therefore, if the video is currently paused, we still play for one second to seek to the correct position

const useDesyncChangeState: (
   current: ScreenControlledVideo,
   onChange: (dto: ScreenControlledVideo) => void,
) => [(patch: Partial<ScreenControlledVideo>) => void, RefObject<ScreenControlledVideo>] = (current, onChange) => {
   const latestStatus = useRef(current);
   latestStatus.current = current;

   const handleChange = (patch: Partial<ScreenControlledVideo>) => {
      // desync support, if continues updates come up without 'current' updating, build upon the latest state
      const updated = { ...latestStatus.current, ...patch };
      onChange(updated);
      latestStatus.current = updated;
   };

   return [handleChange, latestStatus];
};

export default function useManagedVideo(
   current: ScreenControlledVideo,
   onChange: (dto: ScreenControlledVideo) => void,
   control: boolean,
): Partial<ReactPlayerProps> {
   const playerRef = useRef<ReactPlayer>(null);
   const [playing, setPlaying] = useState(true);

   const [initializing, setInitializing] = useState(true);

   const [handleChange, latestStatus] = useDesyncChangeState(current, onChange);

   const handleChangeSafe = (x: Partial<ScreenControlledVideo>) => {
      if (initializing) return;
      handleChange(x);
   };
   const handleOnPlay = () => {
      setPlaying(true);
      handleChangeSafe({ paused: false });
   };

   const handleOnPause = () => {
      setPlaying(false);
      handleChangeSafe({ paused: true });
   };

   useEffect(() => {
      const token = setTimeout(() => {
         // independent of control, this is very important!
         playerRef.current?.seekTo((new Date().getTime() - latestStatus.current!.startPosition) / 1000, 'seconds');
         setInitializing(false);
      }, 1000);

      return () => clearTimeout(token);
   }, [latestStatus]);

   useEffect(() => {
      if (initializing) return;

      setPlaying(!current.paused);
      if (!control) {
         playerRef.current?.seekTo((new Date().getTime() - current.startPosition) / 1000, 'seconds');
      }
   }, [current, initializing]);

   const handleOnProgress = (args: OnProgressProps) => {
      if (initializing) return;

      const startPosition = Math.round(new Date().getTime() - args.playedSeconds * 1000);
      const isOutOfSync = Math.abs(latestStatus.current!.startPosition - startPosition) > TOLERATED_POSITION_DIFF;

      if (isOutOfSync) {
         if (control) {
            handleChangeSafe({ startPosition });
         } else {
            if (!latestStatus.current?.paused) {
               playerRef.current?.seekTo(
                  (new Date().getTime() - latestStatus.current!.startPosition) / 1000,
                  'seconds',
               );
            }
         }
      }
   };

   return {
      ref: playerRef,
      url: current.url,
      onPlay: handleOnPlay,
      onPause: handleOnPause,
      playing,
      onProgress: handleOnProgress,
   };
}
