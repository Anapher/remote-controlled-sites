import { Consumer } from 'mediasoup-client/lib/Consumer';
import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import connectWebRtc from '../../../app/webrtc/web-rtc-connect';
import TokenRestClient from '../../../services/token-rest-client';

type Props = {
   screenName: string;
   socket: Socket;
   token: string;
};
export default function ScreenShareScreenContent({ screenName, token, socket }: Props) {
   const videoRef = useRef<HTMLVideoElement | null>(null);

   useEffect(() => {
      (async () => {
         const client = new TokenRestClient(token);
         const connection = await connectWebRtc(screenName, client, socket);

         connection.on('newConsumer', (consumer: Consumer) => {
            if (consumer?.track) {
               const stream = new MediaStream();
               stream.addTrack(consumer.track);

               console.log(consumer);

               if (videoRef.current) {
                  videoRef.current.srcObject = stream;
               }
            }
         });

         await connection.createReceiveTransport();
      })();
   }, [screenName, token, socket]);

   return <video ref={videoRef} autoPlay style={{ objectFit: 'contain', width: '100%', height: '100%' }} />;
}
