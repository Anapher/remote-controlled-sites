import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

const AnyReactPlayer = ReactPlayer as any;
const Player = (props: ReactPlayerProps) => <AnyReactPlayer {...props} />;

export default Player;
