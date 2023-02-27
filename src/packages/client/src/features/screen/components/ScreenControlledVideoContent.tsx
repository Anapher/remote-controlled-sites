import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab } from '@mui/material';
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
         </Stack>
         <Box flex={1}>
            <ControlledVideo control={useControl} onChange={handleOnChange} content={content} key={`${useControl}`} />
         </Box>
      </Box>
   );
}

type ControlledVideoProps = {
   control: boolean;
   content: ScreenControlledVideo;
   onChange: (content: ScreenControlledVideo) => void;
};

const ControlledVideo = ({ control, content, onChange }: ControlledVideoProps) => {
   const props = useManagedVideo(content, onChange, control);
   return <Player width={'100%'} height={'100%'} {...props} controls={control} />;
};
