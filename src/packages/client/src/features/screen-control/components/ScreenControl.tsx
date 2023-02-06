import { Fab } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import ShareVideoDialog from '../../../components/ShareVideoDialog';
import useScreenShare from '../../../hooks/useScreenShare';
import { ScreenInfo } from '../../../shared/Screen';

type Props = {
   screen: ScreenInfo;
   socket: Socket;
   token: string;
};

export default function ScreenControl({ token, screen, socket }: Props) {
   const [videoShareOpen, setVideoShareOpen] = useState(false);
   const { currentScreenShare, onShareScreen, onStopShareScreen } = useScreenShare(socket, token);

   const handleToggleScreenShare = () => {
      if (currentScreenShare) {
         onStopShareScreen();
      } else {
         onShareScreen(screen);
      }
   };

   return (
      <Box alignItems="center" justifyContent="center" height="100%" width="100%" display="flex">
         <ShareVideoDialog
            screenInfo={screen}
            token={token}
            open={videoShareOpen}
            onClose={() => setVideoShareOpen(true)}
         />
         <Stack direction="column" spacing={2}>
            <Fab color="primary" variant="extended" onClick={handleToggleScreenShare}>
               {currentScreenShare ? 'Bildschirm teilen beenden' : 'Bildschirm teilen'}
            </Fab>
            <Fab color="primary" variant="extended" onClick={() => setVideoShareOpen(true)}>
               Video abspielen
            </Fab>
         </Stack>
      </Box>
   );
}
