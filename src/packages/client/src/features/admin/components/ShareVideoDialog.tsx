import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { Socket } from 'socket.io-client';
import { z } from 'zod';
import { sendPutScreenContent } from '../../../app/useAdminWs';
import { ScreenControlledVideo, ScreenInfo } from '../../../shared/Screen';
import { wrapForInputRef } from '../../../utils/react-hook-form-utils';
import ShareVideoActionsPlayer from './ShareVideoActionsPlayer';

const ShareVideoSchema = z.object({ url: z.string().min(1) });

type ShareVideoForm = z.infer<typeof ShareVideoSchema>;

type Props = {
   open: boolean;
   onClose: () => void;
   socket: Socket;
   screenInfo?: ScreenInfo;
};

export default function ShareVideoDialog({ open, onClose, socket, screenInfo }: Props) {
   const {
      handleSubmit,
      register,
      formState: { isValid },
   } = useForm<ShareVideoForm>({ resolver: zodResolver(ShareVideoSchema), mode: 'onChange' });

   if (!screenInfo) return null;

   const handleSetVideo = (data: ShareVideoForm) => {
      sendPutScreenContent(socket, {
         name: screenInfo.name,
         content: {
            paused: true,
            startPosition: 0,
            type: 'controlled-video',
            url: data.url,
         },
      });
   };

   const handleUpdateVideoStatus = (dto: ScreenControlledVideo) => {
      sendPutScreenContent(socket, {
         name: screenInfo.name,
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
