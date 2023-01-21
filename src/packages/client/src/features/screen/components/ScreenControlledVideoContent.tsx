import Player from '../../../components/TypedVideoPlayer';
import { ScreenControlledVideo } from '../../../shared/Screen';

type Props = {
   content: ScreenControlledVideo;
};

export default function ScreenControlledVideoContent({ content }: Props) {
   return <Player url={content.url} height="100%" width="100%" playing={!content.paused} />;
}
