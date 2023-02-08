import { Button, Container, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { RootState } from '../../../app/store';
import { createScreen, deleteScreen } from '../../../services/screen';
import { ScreenDto } from '../../../shared/Screen';
import CreateEditDialog from './CreateEditScreenDialog';
import ScreensTable from './ScreensTable';

type Props = {
   socket: Socket;
};

/**
 * The view after successful authorization, show available screens and
 * provide methods to edit and create them
 */
export default function AuthorizedIndex({ socket }: Props) {
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingScreen, setEditingScreen] = useState<ScreenDto | null>(null);
   const token = useSelector((state: RootState) => state.admin.authToken)!;

   const createScreenMutation = useMutation({
      mutationFn: createScreen,
   });

   const deleteScreenMutation = useMutation({
      mutationFn: deleteScreen,
   });

   const handleCloseDialog = () => setDialogOpen(false);

   const handleOpenDialogCreate = () => {
      setDialogOpen(true);
      setEditingScreen(null);
   };

   const handleOpenDialogEdit = (data: ScreenDto) => {
      setDialogOpen(true);
      setEditingScreen(data);
   };

   const handleCreate = (data: ScreenDto) => {
      createScreenMutation.mutate({ dto: data, token });
      handleCloseDialog();
   };

   const handleDeleteScreen = (data: ScreenDto) => {
      deleteScreenMutation.mutate({ screenName: data.name, token });
   };

   return (
      <Container maxWidth="md">
         <Typography variant="h4" textAlign="center" gutterBottom sx={{ mt: 6 }}>
            Bildschirme
         </Typography>

         <Paper>
            <ScreensTable socket={socket} onDelete={handleDeleteScreen} onEdit={handleOpenDialogEdit} />
         </Paper>
         <Button onClick={handleOpenDialogCreate} sx={{ mt: 3 }} variant="contained">
            Neuen Bildschirm erstellen
         </Button>
         {dialogOpen && (
            <CreateEditDialog
               isEditing={!!editingScreen}
               open={true}
               onClose={handleCloseDialog}
               onExecute={handleCreate}
               data={editingScreen || {}}
            />
         )}
      </Container>
   );
}
