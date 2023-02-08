import { Fab } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import ReadonlySyncVideo from '../../../components/ReadonlySyncVideo';
import SyncVideo from '../../../components/SyncVideo';
import { setScreenContent } from '../../../services/screen';
import { ScreenControlledVideo } from '../../../shared/Screen';

type Props = {
   content: ScreenControlledVideo;
   screenName: string;
   token: string;
};

export default function ScreenControlledVideoContent({ content, screenName, token }: Props) {
   const mutation = useMutation({
      mutationFn: setScreenContent,
   });

   const [useControl, setUseControl] = useState(false);

   const handleGoBack = () => {
      mutation.mutate({ content: null, token, screenName });
   };

   const handleOnChange = (content: ScreenControlledVideo) => {
      mutation.mutate({ content, token, screenName });
   };

   const handleToggleControl = () => {
      setUseControl((prev) => !prev);
   };

   return (
      <Box width="100%" height="100%" display="flex" flexDirection="column">
         <Stack spacing={2} p={1} direction="row">
            <Fab variant="extended" onClick={handleGoBack}>
               Zurück
            </Fab>
            <Fab variant="extended" onClick={handleToggleControl} color={useControl ? 'secondary' : undefined}>
               {!useControl ? 'Video kontrollieren' : 'Video nicht mehr kontrollieren'}
            </Fab>
         </Stack>
         <Box flex={1}>
            {useControl ? (
               <SyncVideo current={content} onChange={handleOnChange} fullscreen />
            ) : (
               <ReadonlySyncVideo content={content} />
            )}
         </Box>
      </Box>
   );
}
