import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { ScreenDto } from "../../../shared/Screen";

type Props = {
  data: Partial<ScreenDto>;
  open: boolean;
  onClose: () => void;
  onExecute: (data: ScreenDto) => void;
};

export default function CreateEditDialog({
  data,
  open,
  onClose,
  onExecute,
}: Props) {
  const handleCreate = () => {
    onExecute({ name: "test" });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Neuen Bildschirm erstellen</DialogTitle>
      <DialogActions>
        <Button onClick={handleCreate}>Erstellen</Button>
      </DialogActions>
    </Dialog>
  );
}
