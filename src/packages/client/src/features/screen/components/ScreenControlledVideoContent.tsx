import { Fab } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { setScreenContent } from '../../../services/screen';
import { ScreenControlledVideo } from '../../../shared/Screen';
import Player from '../../../components/TypedVideoPlayer';
import useVideoReadOnly from '../../../hooks/useVideoReadOnly';
import useVideoWrite from '../../../hooks/useVideoWrite';

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

   const readOnlyProps = useVideoReadOnly(content);
   const writeProps = useVideoWrite(content, handleOnChange);

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
            <Player width={'100%'} height={'100%'} {...(useControl ? writeProps : readOnlyProps)} controls={true} />
         </Box>
      </Box>
   );
}
