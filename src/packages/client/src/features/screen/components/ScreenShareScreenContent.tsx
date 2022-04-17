import { Consumer } from 'mediasoup-client/lib/Consumer';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import connectWebRtc from '../../../app/webrtc/web-rtc-connect';
import { WebRtcConnection } from '../../../app/webrtc/WebRtcConnection';
import TokenRestClient from '../../../services/token-rest-client';
import { REQUEST_LEAVE_ROOM } from '../../../shared/ws-server-messages';

type Props = {
   screenName: string;
   socket: Socket;
   token: string;
};
export default function ScreenShareScreenContent({ screenName, token, socket }: Props) {
   const videoRef = useRef<HTMLVideoElement | null>(null);
   const [stream, setStream] = useState<MediaStream | null>(null);

   useEffect(() => {
      let connection: WebRtcConnection | null = null;

      (async () => {
         const client = new TokenRestClient(token);
         connection = await connectWebRtc(screenName, client, socket);

         connection?.on('newConsumer', (consumer: Consumer) => {
            if (consumer?.track) {
               const stream = new MediaStream();
               stream.addTrack(consumer.track);

               setStream(stream);
            }
         });

         await connection?.createReceiveTransport();
      })();

      return () => {
         connection?.close();
         connection = null;

         socket.emit(REQUEST_LEAVE_ROOM);
      };
   }, [screenName, token, socket]);

   useEffect(() => {
      if (videoRef?.current) {
         videoRef.current.srcObject = stream;
      }
   }, [stream, videoRef]);

   return <video ref={videoRef} muted autoPlay style={{ objectFit: 'contain', width: '100%', height: '100%' }} />;
}
