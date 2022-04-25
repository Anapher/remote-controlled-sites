import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Consumer } from 'mediasoup-client/lib/Consumer';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import connectWebRtc from '../../../app/webrtc/web-rtc-connect';
import { WebRtcConnection } from '../../../app/webrtc/WebRtcConnection';
import TokenRestClient from '../../../services/token-rest-client';
import { ProducerSource } from '../../../shared/webrtc-types';
import { REQUEST_LEAVE_ROOM } from '../../../shared/ws-server-messages';

const Container = styled('div')({
   height: '100%',
   width: '100%',
   position: 'relative',
   backgroundColor: 'black',
});

const Video = styled('video')({
   position: 'absolute',
   objectFit: 'contain',
   height: '100%',
   width: '100%',
   top: 0,
   bottom: 0,
   left: 0,
   right: 0,
});

const AudioNotice = styled('div')({
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   position: 'absolute',
   bottom: '20%',
   left: 0,
   right: 0,
});

const AudioNoticeContent = styled('div')(({ theme }) => ({
   backgroundColor: 'rgba(0,0,0,0.8)',
   padding: 8,
   borderRadius: theme.shape.borderRadius,
   color: 'white',
}));

type Props = {
   screenName: string;
   socket: Socket;
   token: string;
};
export default function ScreenShareScreenContent({ screenName, token, socket }: Props) {
   const videoRef = useRef<HTMLVideoElement | null>(null);
   const stream = useRef(new MediaStream());
   const [muted, setMuted] = useState(true);
   const [hasAudio, setHasAudio] = useState(false);

   const handleClick = () => {
      setMuted(false);
      console.log('unmuted');
   };

   useEffect(() => {
      let connection: WebRtcConnection | null = null;

      (async () => {
         const client = new TokenRestClient(token);
         connection = await connectWebRtc(screenName, client, socket);

         connection?.on('newConsumer', (consumer: Consumer) => {
            if (consumer?.track) {
               const source = consumer.appData.source as ProducerSource;

               if (source === 'screen') {
                  stream.current.addTrack(consumer.track);
               } else if (source === 'sys-audio') {
                  stream.current.addTrack(consumer.track);
                  setHasAudio(true);
               }
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
         videoRef.current.srcObject = stream.current;
      }
   }, [stream, videoRef]);

   return (
      <Container>
         <Video ref={videoRef} muted={muted} autoPlay onClick={handleClick} />
         {hasAudio && muted && (
            <AudioNotice>
               <AudioNoticeContent>
                  <Typography fontSize={24}>Bitte hier auf den Bildschirm klicken, um den Ton zu aktivieren</Typography>
               </AudioNoticeContent>
            </AudioNotice>
         )}
      </Container>
   );
}
