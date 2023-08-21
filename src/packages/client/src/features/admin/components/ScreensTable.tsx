import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import {
   Button,
   ButtonGroup,
   Divider,
   MenuItem,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Tooltip,
   Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { RootState } from '../../../app/store';
import ShareVideoDialog from '../../../components/ShareVideoDialog';
import useScreenShare from '../../../hooks/useScreenShare';
import { fetchAllScreens, setScreenContent } from '../../../services/screen';
import { ScreenContent, ScreenDto, ScreenInfo } from '../../../shared/Screen';
import ScreensContentActionPopper from './ScreensContentActionPopper';
import AddLinkIcon from '@mui/icons-material/AddLink';

// workaround for issue with Popper: https://github.com/mui/material-ui/issues/35287#issuecomment-1337250566, until we are using @types/react@18
declare global {
   namespace React {
      interface DOMAttributes<T> {
         onResize?: ReactEventHandler<T> | undefined;
         onResizeCapture?: ReactEventHandler<T> | undefined;
         nonce?: string | undefined;
      }
   }
}

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

   if (content.type === 'controlled-video') {
      return (
         <Typography fontSize="inherit" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            Video {content.url}
         </Typography>
      );
   }
}

type Props = {
   onDelete: (screen: ScreenDto) => void;
   onEdit: (screen: ScreenDto) => void;
   socket: Socket;
};

export default function ScreensTable({ onDelete, onEdit, socket }: Props) {
   const { data } = useQuery({ queryKey: ['all_screens'], queryFn: fetchAllScreens });

   const [contentPopperOpen, setContentPopperOpen] = useState(false);
   const contentPopperAnchorRef = useRef<HTMLElement>();
   const [currentContentPopperItem, setCurrentContentPopperItem] = useState<string>();

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

   const handleCopyControlUrl = (screen: ScreenDto) => {
      navigator.clipboard.writeText(window.location.origin + '/screens/' + screen.name + '/control');
   };

   const handleOpenShareVideo = (name: string) => {
      setShareVideoScreenName(name);
      setShareVideoOpen(true);
   };
   const handleCloseShareVideo = () => setShareVideoOpen(false);

   const handleOpenContentPopper = (ev: React.MouseEvent<HTMLButtonElement>, screen: ScreenInfo) => {
      contentPopperAnchorRef.current = ev.target as HTMLElement;
      setCurrentContentPopperItem(screen.name);

      if (screen.name === currentContentPopperItem && contentPopperOpen) {
         setContentPopperOpen(false);
      } else {
         setContentPopperOpen(true);
      }
   };

   const mutation = useMutation({
      mutationFn: setScreenContent,
   });

   const handleDeleteScreenContent = (screenName: string) => {
      mutation.mutate({ token, screenName, content: null });
   };

   return (
      <Table style={{ width: '100%', tableLayout: 'fixed' }}>
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

         <ScreensContentActionPopper
            open={contentPopperOpen}
            anchor={contentPopperAnchorRef}
            onClose={() => setContentPopperOpen(false)}
            screen={data?.screens.find((x) => x.name === currentContentPopperItem)}
            renderMenuItems={(screen) => (
               <>
                  <MenuItem onClick={() => handleOpenShareVideo(screen.name)}>Video teilen</MenuItem>
                  {currentScreenShare?.name === screen.name ? (
                     <MenuItem onClick={onStopShareScreen} color="secondary">
                        Bildschirm nicht mehr teilen
                     </MenuItem>
                  ) : (
                     <MenuItem onClick={() => onShareScreen(screen)} disabled={screen.content?.type === 'screenshare'}>
                        Bildschirm teilen
                     </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => handleDeleteScreenContent(screen.name)}>Entfernen</MenuItem>
               </>
            )}
         />

         <TableBody>
            {data?.screens.map((x) => (
               <TableRow key={x.name}>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{renderContent(x.content)}</TableCell>
                  <TableCell>
                     <ButtonGroup size="small">
                        <Button onClick={(ev) => handleOpenContentPopper(ev, x)} color="primary">
                           Content setzen
                        </Button>

                        <Tooltip title="Url kopieren">
                           <Button onClick={() => handleCopyUrl(x)} aria-label="url kopieren">
                              <LinkIcon />
                           </Button>
                        </Tooltip>
                        <Tooltip title="Control-Url kopieren">
                           <Button onClick={() => handleCopyControlUrl(x)} aria-label="url kopieren">
                              <AddLinkIcon />
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
