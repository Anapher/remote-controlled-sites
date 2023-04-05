import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { setScreenContent } from '../services/screen';
import { ScreenControlledVideo, ScreenControlledVideoSchemaUrl, ScreenInfo } from '../shared/Screen';
import { wrapForInputRef } from '../utils/react-hook-form-utils';
import ShareVideoActionsPlayer from '../features/admin/components/ShareVideoActionsPlayer';

const ShareVideoSchema = z.object({ url: ScreenControlledVideoSchemaUrl });

type ShareVideoForm = z.infer<typeof ShareVideoSchema>;

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
      formState: { isValid },
   } = useForm<ShareVideoForm>({ resolver: zodResolver(ShareVideoSchema), mode: 'onChange' });

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
                  <TextField label="Video URL" size="small" fullWidth autoFocus {...wrapForInputRef(register('url'))} />
                  <div>
                     <Button variant="contained" disabled={!isValid} type="submit">
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
