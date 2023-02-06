import { Producer } from 'mediasoup-client/lib/types';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import connectWebRtc from '../app/webrtc/web-rtc-connect';
import { WebRtcConnection } from '../app/webrtc/WebRtcConnection';
import TokenRestClient from '../services/token-rest-client';
import { ScreenDto } from '../shared/Screen';
import { REQUEST_LEAVE_ROOM } from '../shared/ws-server-messages';

type CurrentScreenShareState = {
   name: string;
   connection: WebRtcConnection;
   producer: Producer;
   track: MediaStreamTrack;
};

export default function useScreenShare(socket: Socket, token: string) {
   const [currentScreenShare, setCurrentScreenShare] = useState<CurrentScreenShareState | null>(null);

   const onShareScreen = async (screen: ScreenDto) => {
      const constraints: MediaStreamConstraints = { video: { height: { ideal: 1080 }, frameRate: 25 }, audio: true };
      const stream = (await (navigator.mediaDevices as any).getDisplayMedia(constraints)) as MediaStream;

      const track = stream.getVideoTracks()[0];

      console.log('connect web rtc');

      const client = new TokenRestClient(token);
      const connection = await connectWebRtc(screen.name, client, socket);

      console.log('webrtc connection created');

      const transport = await connection.createSendTransport();
      const producer = await transport.produce({
         track,
         appData: { source: 'screen' },
      });

      producer.on('transportclose', () => {
         setCurrentScreenShare(null);
      });

      producer.on('trackended', () => {
         setCurrentScreenShare(null);
      });

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
         const audioTrack = audioTracks[0];

         await transport.produce({
            track: audioTrack,
            appData: { source: 'sys-audio' },
         });
      }

      setCurrentScreenShare({ track, producer, connection, name: screen.name });
   };

   const onStopShareScreen = () => {
      setCurrentScreenShare(null);
   };

   useEffect(() => {
      if (!currentScreenShare) return;

      return () => {
         currentScreenShare.connection.close();
         currentScreenShare.track.stop();

         socket.emit(REQUEST_LEAVE_ROOM);
      };
   }, [currentScreenShare, socket]);

   return { currentScreenShare, onShareScreen, onStopShareScreen };
}
