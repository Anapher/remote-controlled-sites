import { Fab, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { setScreenContent } from '../../../services/screen';
import { ScreenControlledVideo } from '../../../shared/Screen';
import Player from '../../../components/TypedVideoPlayer';
import useVideoWrite from '../../../hooks/useVideoWrite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { selectHadUserInteraction } from '../../user-interaction/selectors';
import RequestUserInteractionView from '../../user-interaction/components/RequestUserInteractionView';

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

   const [writeProps, isOutOfSync] = useVideoWrite(content, handleOnChange, !useControl);

   const hadInteraction = useSelector(selectHadUserInteraction);

   if (!hadInteraction) return <RequestUserInteractionView />;

   return (
      <Box width="100%" height="100%" display="flex" flexDirection="column">
         <Stack spacing={2} p={1} direction="row">
            <Fab variant="extended" onClick={handleGoBack} sx={{ width: 200 }}>
               <ArrowBackIcon sx={{ mr: 1 }} />
               <span style={{ flex: 1 }}>Zurück</span>
            </Fab>
            <Fab variant="extended" onClick={handleToggleControl} color={useControl ? 'secondary' : undefined}>
               {!useControl ? 'Video kontrollieren' : 'Video nicht mehr kontrollieren'}
            </Fab>
            {isOutOfSync && (
               <Typography sx={{ flex: 1 }} align="right">
                  Desync
               </Typography>
            )}
         </Stack>
         <Box flex={1}>
            <Player width={'100%'} height={'100%'} {...writeProps} controls={true} />
         </Box>
      </Box>
   );
}
