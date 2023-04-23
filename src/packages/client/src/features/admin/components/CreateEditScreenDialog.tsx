import {
   Button,
   Checkbox,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   FormControlLabel,
   Stack,
   TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScreenDto, ScreenSchema } from '../../../shared/Screen';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
   data: Partial<ScreenDto>;
   open: boolean;
   onClose: () => void;
   onExecute: (data: ScreenDto) => void;
   isEditing: boolean;
};

export default function CreateEditDialog({ data, open, onClose, onExecute, isEditing }: Props) {
   const { control, handleSubmit, reset } = useForm<ScreenDto>({
      defaultValues: {
         name: '',
         defaultContent: '',
         onlyScreenShareAllowed: false,
         allowedVideoHostNames: 'www.youtube.com\nwww.youtu.be',
         ...data,
      },
      resolver: zodResolver(ScreenSchema),
   });

   useEffect(() => {
      reset();
   }, [reset, open]);

   const onSubmit = (data: ScreenDto) => {
      onExecute(data);
   };

   return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
         <DialogTitle>{isEditing ? 'Bildschirm bearbeiten' : 'Neuen Bildschirm erstellen'}</DialogTitle>
         <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
               <Stack spacing={2}>
                  <Controller
                     control={control}
                     name="name"
                     render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                           autoFocus
                           variant="standard"
                           value={value}
                           onChange={onChange}
                           label="Name"
                           error={!!error}
                           helperText={error?.message}
                           disabled={isEditing}
                           required
                        />
                     )}
                  />
                  <Controller
                     control={control}
                     name="defaultContent"
                     render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                           variant="standard"
                           value={value}
                           onChange={onChange}
                           label="Standard-Url"
                           error={!!error}
                           helperText={error?.message}
                        />
                     )}
                  />
                  <Controller
                     control={control}
                     name="onlyScreenShareAllowed"
                     render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                           control={<Checkbox checked={value} onChange={onChange} />}
                           label="Nur Bildschirm teilen erlauben"
                        />
                     )}
                  />
                  <Controller
                     control={control}
                     name="allowedVideoHostNames"
                     render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                           variant="standard"
                           value={value}
                           onChange={onChange}
                           label="Erlaubte Url-Hostnames für Videos"
                           error={!!error}
                           helperText={error?.message}
                           multiline
                           maxRows={4}
                        />
                     )}
                  />
               </Stack>
            </DialogContent>
            <DialogActions>
               <Button onClick={onClose}>Abbrechen</Button>
               <Button type="submit">{isEditing ? 'Aktualisieren' : 'Erstellen'}</Button>
            </DialogActions>
         </form>
      </Dialog>
   );
}
