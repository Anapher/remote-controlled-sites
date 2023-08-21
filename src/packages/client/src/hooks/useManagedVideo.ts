import { RefObject, useEffect, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { TOLERATED_POSITION_DIFF } from '../config';
import useSynchronizedTime from '../features/sync-time/useSynchronizedTime';
import { ScreenControlledVideo } from '../shared/Screen';

// https://github.com/cookpete/react-player/blob/2811bc59b9368170acc20d4f1e39555413d0d9e1/src/patterns.js#L3C1-L4C1
export const MATCH_URL_YOUTUBE =
   /(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;

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
   const { getSyncedTime } = useSynchronizedTime();

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
      if (!MATCH_URL_YOUTUBE.test(current.url)) {
         setInitializing(false);
         return;
      }

      const token = setTimeout(() => {
         // independent of control, this is very important!
         playerRef.current?.seekTo((getSyncedTime() - latestStatus.current!.startPosition) / 1000, 'seconds');
         setInitializing(false);
      }, 1000);

      return () => clearTimeout(token);
   }, []);

   useEffect(() => {
      if (initializing) return;

      setPlaying(!current.paused);
      if (!control) {
         playerRef.current?.seekTo((getSyncedTime() - current.startPosition) / 1000, 'seconds');
      }
   }, [current, initializing]);

   const handleOnProgress = (args: OnProgressProps) => {
      if (initializing) return;

      const startPosition = Math.round(getSyncedTime() - args.playedSeconds * 1000);
      const isOutOfSync = Math.abs(latestStatus.current!.startPosition - startPosition) > TOLERATED_POSITION_DIFF;

      if (isOutOfSync) {
         if (control) {
            handleChangeSafe({ startPosition });
         } else {
            if (!latestStatus.current?.paused) {
               playerRef.current?.seekTo((getSyncedTime() - latestStatus.current!.startPosition) / 1000, 'seconds');
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
