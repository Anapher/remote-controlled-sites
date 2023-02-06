import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import {
   Button,
   ButtonGroup,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Tooltip,
   Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { RootState } from '../../../app/store';
import ShareVideoDialog from '../../../components/ShareVideoDialog';
import useScreenShare from '../../../hooks/useScreenShare';
import { fetchAllScreens } from '../../../services/screen';
import { ScreenContent, ScreenDto } from '../../../shared/Screen';

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

   if (content.type === 'screenshare') {
      return <Typography fontSize="inherit">Bildschirm wird geteilt</Typography>;
   }
}

type Props = {
   onDelete: (screen: ScreenDto) => void;
   onEdit: (screen: ScreenDto) => void;
   socket: Socket;
};

export default function ScreensTable({ onDelete, onEdit, socket }: Props) {
   const { data } = useQuery({ queryKey: ['all_screens'], queryFn: fetchAllScreens });

   const [shareVideoOpen, setShareVideoOpen] = useState(false);
   const [shareVideoScreenName, setShareVideoScreenName] = useState('');

   const token = useSelector((state: RootState) => state.admin.authToken)!;

   const { currentScreenShare, onShareScreen, onStopShareScreen } = useScreenShare(socket, token);

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

   const handleOpenShareVideo = (name: string) => {
      setShareVideoScreenName(name);
      setShareVideoOpen(true);
   };
   const handleCloseShareVideo = () => setShareVideoOpen(false);

   return (
      <Table>
         <ShareVideoDialog
            open={shareVideoOpen}
            onClose={handleCloseShareVideo}
            token={token}
            screenInfo={data?.screens.find((x) => x.name === shareVideoScreenName)}
         />
         <TableHead>
            <TableRow>
               <TableCell>Name</TableCell>
               <TableCell>Aktueller Content</TableCell>
               <TableCell>Aktionen</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data?.screens.map((x) => (
               <TableRow key={x.name}>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{renderContent(x.content)}</TableCell>
                  <TableCell>
                     <ButtonGroup size="small">
                        {currentScreenShare?.name === x.name ? (
                           <Button onClick={onStopShareScreen} color="secondary">
                              Bildschirm nicht mehr teilen
                           </Button>
                        ) : (
                           <Button onClick={() => onShareScreen(x)} disabled={x.content?.type === 'screenshare'}>
                              Bildschirm teilen
                           </Button>
                        )}
                        <Button onClick={() => handleOpenShareVideo(x.name)}>Video teilen</Button>
                        <Tooltip title="Url kopieren">
                           <Button onClick={() => handleCopyUrl(x)} aria-label="url kopieren">
                              <LinkIcon />
                           </Button>
                        </Tooltip>
                        <Tooltip title="Bearbeiten">
                           <Button onClick={() => onEdit(x)} aria-label="bearbeiten">
                              <EditIcon />
                           </Button>
                        </Tooltip>
                        <Tooltip title="Löschen">
                           <Button onClick={() => handleDeleteWithConfirm(x)} aria-label="löschen">
                              <DeleteIcon />
                           </Button>
                        </Tooltip>
                     </ButtonGroup>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
}
