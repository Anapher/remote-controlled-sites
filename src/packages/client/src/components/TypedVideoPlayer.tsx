import React from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

const AnyReactPlayer = ReactPlayer as any;
const Player = React.forwardRef<ReactPlayer, ReactPlayerProps>((props, ref) => <AnyReactPlayer {...props} ref={ref} />);

export default Player;
