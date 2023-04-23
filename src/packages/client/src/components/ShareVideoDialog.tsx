import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setScreenContent } from '../services/screen';
import {
   ScreenControlledVideo,
   ScreenControlledVideoSchemaUrl,
   ScreenInfo,
   validateUrlAgainstHostnames,
} from '../shared/Screen';
import { wrapForInputRef } from '../utils/react-hook-form-utils';
import ShareVideoActionsPlayer from '../features/admin/components/ShareVideoActionsPlayer';

const ShareVideoSchema = (screen?: ScreenInfo) =>
   z.object({
      url: ScreenControlledVideoSchemaUrl.refine(
         (s) => validateUrlAgainstHostnames(s, screen?.allowedVideoHostNames),
         'Only specific urls are allowed, they can be configured in the screen config',
      ),
   });

type ShareVideoForm = z.infer<ReturnType<typeof ShareVideoSchema>>;

type Props = {
   open: boolean;
   onClose: () => void;
   screenInfo?: ScreenInfo;
   token: string;
};

export default function ShareVideoDialog({ open, onClose, screenInfo, token }: Props) {
   const {
      handleSubmit,
      register,
      formState: { errors, isValid },
   } = useForm<ShareVideoForm>({ resolver: zodResolver(ShareVideoSchema(screenInfo)), mode: 'onChange' });

   const mutation = useMutation({
      mutationFn: setScreenContent,
   });

   if (!screenInfo) return null;
   if (!token) return null;

   const handleSetVideo = (data: ShareVideoForm) => {
      mutation.mutate({
         token,
         screenName: screenInfo.name,
         content: {
            paused: true,
            startPosition: 0,
            type: 'controlled-video',
            url: data.url,
         },
      });
   };

   const handleUpdateVideoStatus = (dto: ScreenControlledVideo) => {
      mutation.mutate({
         token,
         screenName: screenInfo.name,
         content: dto,
      });
   };

   return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
         <DialogTitle>Video teilen</DialogTitle>
         <DialogContent>
            <form onSubmit={handleSubmit(handleSetVideo)}>
               <Stack my={2} spacing={1}>
                  <TextField
                     label="Video URL"
                     size="small"
                     fullWidth
                     autoFocus
                     {...wrapForInputRef(register('url'))}
                     helperText={errors.url?.message}
                     FormHelperTextProps={{ color: 'red' }}
                  />
                  <div>
                     <Button variant="contained" type="submit" disabled={!isValid}>
                        Teilen
                     </Button>
                  </div>
                  {screenInfo.content?.type === 'controlled-video' && (
                     <ShareVideoActionsPlayer current={screenInfo.content} onChange={handleUpdateVideoStatus} />
                  )}
               </Stack>
            </form>
         </DialogContent>
      </Dialog>
   );
}
