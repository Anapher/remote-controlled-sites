import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  message: string;
};

export default function Loading({ message }: Props) {
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Stack spacing={4} direction="row" alignItems="center">
        <CircularProgress />
        <Typography>{message}</Typography>
      </Stack>
    </Box>
  );
}
