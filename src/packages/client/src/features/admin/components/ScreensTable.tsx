import { Button, ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import TokenRestClient from '../../../services/token-rest-client';
import connectWebRtc from '../../../app/webrtc/web-rtc-send';
import { ScreenContent, ScreenDto } from '../../../shared/Screen';
import { JoinRoomRequest, REQUEST_JOIN_ROOM } from '../../../shared/ws-server-messages';
import Token from '../hooks/useToken';
import { selectScreens } from '../slice';

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

type Props = {
   onDelete: (screen: ScreenDto) => void;
   onEdit: (screen: ScreenDto) => void;
   socket: Socket;
};

export default function ScreensTable({ onDelete, onEdit, socket }: Props) {
   const screens = useSelector(selectScreens);
   const token = useContext(Token);
   const [currentScreenShare, setCurrentScreenShare] = useState(null);

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
      socket.emit(REQUEST_JOIN_ROOM);
      const client = new TokenRestClient(token);
      const connection = await connectWebRtc(screen.name, client, socket);
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
                        <Button onClick={() => handleShareScreen(x)}>Bildschirm teilen</Button>
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
