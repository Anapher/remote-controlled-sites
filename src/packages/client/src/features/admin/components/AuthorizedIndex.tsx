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

  useEffect(() => {
    sendRequestScreens(socket);
  }, [socket]);

  const handleCloseDialog = () => setDialogOpen(false);
  const handleOpenDialog = () => setDialogOpen(true);

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
      <Button onClick={handleOpenDialog}>Neuen Bildschirm erstellen</Button>
      <ScreensTable onDelete={handleDeleteScreen} />
      <CreateEditDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onExecute={handleCreate}
        data={{}}
      />
    </Container>
  );
}
