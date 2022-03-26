import { Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  sendDelScreen,
  sendPutScreen,
  sendRequestScreens,
} from "../../../app/useAdminWs";
import { ScreenDto } from "../../../shared/Screen";
import CreateEditDialog from "./CreateEditDialog";
import ScreensTable from "./ScreensTable";

type Props = {
  socket: Socket;
};

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
    <Container maxWidth="md" sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Bildschirme
      </Typography>
      <Button onClick={handleOpenDialogCreate}>
        Neuen Bildschirm erstellen
      </Button>
      <ScreensTable
        onDelete={handleDeleteScreen}
        onEdit={handleOpenDialogEdit}
      />
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
