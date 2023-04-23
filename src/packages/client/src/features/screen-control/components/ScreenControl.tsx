import { Fab, Typography } from '@mui/material';
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
            onClose={() => setVideoShareOpen(false)}
         />
         <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
               Inhalte für Screen <b>{screen.name}</b>
            </Typography>
            <Stack direction="row" spacing={2}>
               <Fab color="primary" variant="extended" onClick={handleToggleScreenShare} sx={{ width: 300 }}>
                  {currentScreenShare ? 'Bildschirm teilen beenden' : 'Bildschirm teilen'}
               </Fab>
               {!screen.onlyScreenShareAllowed && (
                  <Fab color="primary" variant="extended" onClick={() => setVideoShareOpen(true)} sx={{ width: 300 }}>
                     Video abspielen
                  </Fab>
               )}
            </Stack>
         </Box>
      </Box>
   );
}
