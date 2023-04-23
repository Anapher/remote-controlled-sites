import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab, Slider, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Player from '../../../components/TypedVideoPlayer';
import useManagedVideo from '../../../hooks/useManagedVideo';
import { setScreenContent } from '../../../services/screen';
import { ScreenControlledVideo } from '../../../shared/Screen';
import RequestUserInteractionView from '../../user-interaction/components/RequestUserInteractionView';
import { selectHadUserInteraction } from '../../user-interaction/selectors';
import { createId } from '@paralleldrive/cuid2';
import { useState } from 'react';

const clientId = createId();

type Props = {
   content: ScreenControlledVideo;
   screenName: string;
   token: string;
};

export default function ScreenControlledVideoContent({ content, screenName, token }: Props) {
   const mutation = useMutation({
      mutationFn: setScreenContent,
   });

   const useControl = content.controlToken === clientId;

   const handleGoBack = () => {
      mutation.mutate({ content: null, token, screenName });
   };

   const handleOnChange = (content: ScreenControlledVideo) => {
      mutation.mutate({ content, token, screenName });
   };

   const handleToggleControl = () => {
      mutation.mutate({ token, screenName, content: { ...content, controlToken: useControl ? undefined : clientId } });
   };

   const [volume, setVolume] = useState(1);

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
            <Box flex={1} display="flex" flexDirection="row-reverse">
               <Box flex={1} maxWidth={200} mx={2}>
                  <Typography variant="caption">Lautstärke</Typography>
                  <Slider
                     min={0}
                     max={1}
                     step={0.1}
                     value={volume}
                     onChange={(_, value) => setVolume(value as number)}
                  />
               </Box>
            </Box>
         </Stack>
         <Box flex={1}>
            <ControlledVideo
               control={useControl}
               onChange={handleOnChange}
               content={content}
               key={`${useControl}`}
               volume={volume}
            />
         </Box>
      </Box>
   );
}

type ControlledVideoProps = {
   control: boolean;
   content: ScreenControlledVideo;
   onChange: (content: ScreenControlledVideo) => void;
   volume?: number;
};

const ControlledVideo = ({ control, content, onChange, volume }: ControlledVideoProps) => {
   const props = useManagedVideo(content, onChange, control);
   return <Player width={'100%'} height={'100%'} {...props} controls={control} volume={volume} />;
};
