import { Button, ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import TokenRestClient from '../../../services/token-rest-client';
import connectWebRtc from '../../../app/webrtc/web-rtc-connect';
import { ScreenContent, ScreenDto } from '../../../shared/Screen';
import { selectScreens } from '../slice';
import { WebRtcConnection } from '../../../app/webrtc/WebRtcConnection';
import { Producer } from 'mediasoup-client/lib/Producer';
import { REQUEST_LEAVE_ROOM } from '../../../shared/ws-server-messages';
import { RootState } from '../../../app/store';

function renderContent(content: ScreenContent | null) {
   if (!content)
      return (
         <Typography fontSize="inherit" fontStyle="italic">
            Keiner
         </Typography>
      );

   if (content.type === 'url') {
      return <Typography fontSize="inherit">{content.url}</Typography>;
   }
}

type CurrentScreenShareState = {
   name: string;
   connection: WebRtcConnection;
   producer: Producer;
   track: MediaStreamTrack;
};

type Props = {
   onDelete: (screen: ScreenDto) => void;
   onEdit: (screen: ScreenDto) => void;
   socket: Socket;
};

export default function ScreensTable({ onDelete, onEdit, socket }: Props) {
   const screens = useSelector(selectScreens);

   const token = useSelector((state: RootState) => state.admin.authToken)!;
   const [currentScreenShare, setCurrentScreenShare] = useState<CurrentScreenShareState | null>(null);

   useEffect(() => {
      if (!currentScreenShare) return;

      return () => {
         currentScreenShare.connection.close();
         currentScreenShare.track.stop();

         socket.emit(REQUEST_LEAVE_ROOM);
      };
   }, [currentScreenShare, socket]);

   const handleDeleteWithConfirm = (screen: ScreenDto) => {
      if (
         // eslint-disable-next-line no-restricted-globals
         confirm(`Sind Sie sicher, dass Sie den Bildschirm ${screen.name} löschen möchten?`)
      ) {
         onDelete(screen);
      }
   };

   const handleCopyUrl = (screen: ScreenDto) => {
      navigator.clipboard.writeText(window.location.origin + '/screens/' + screen.name);
   };

   const handleShareScreen = async (screen: ScreenDto) => {
      const constraints: MediaStreamConstraints = { video: { height: { ideal: 1080 }, frameRate: 25 } };
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

      setCurrentScreenShare({ track, producer, connection, name: screen.name });
   };

   const handleStopSharingScreen = () => {
      setCurrentScreenShare(null);
   };

   return (
      <Table>
         <TableHead>
            <TableRow>
               <TableCell>Name</TableCell>
               <TableCell>Aktueller Content</TableCell>
               <TableCell>Aktionen</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {screens?.map((x) => (
               <TableRow key={x.name}>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{renderContent(x.content)}</TableCell>
                  <TableCell>
                     <ButtonGroup size="small">
                        <Button onClick={() => handleCopyUrl(x)}>Url kopieren</Button>
                        {currentScreenShare?.name === x.name ? (
                           <Button onClick={handleStopSharingScreen} color="secondary">
                              Bildschirm nicht mehr teilen
                           </Button>
                        ) : (
                           <Button onClick={() => handleShareScreen(x)}>Bildschirm teilen</Button>
                        )}
                        <Button onClick={() => onEdit(x)}>Bearbeiten</Button>
                        <Button onClick={() => handleDeleteWithConfirm(x)}>Löschen</Button>
                     </ButtonGroup>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
