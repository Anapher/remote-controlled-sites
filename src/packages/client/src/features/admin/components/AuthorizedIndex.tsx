import { Button, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { sendDelScreen, sendPutScreen, sendRequestScreens } from '../../../app/useAdminWs';
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

   useEffect(() => {
      sendRequestScreens(socket);
   }, [socket]);

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
      sendPutScreen(socket, data);
      handleCloseDialog();
   };

   const handleDeleteScreen = (data: ScreenDto) => {
      sendDelScreen(socket, data.name);
   };

   return (
      <Container maxWidth="md">
         <Typography variant="h4" textAlign="center" gutterBottom>
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
