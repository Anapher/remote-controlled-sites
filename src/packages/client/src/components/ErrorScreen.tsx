import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {
  message: string;
};

export default function ErrorScreen({ message }: Props) {
  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography sx={{ m: 4 }} textAlign="center">
        {message}
      </Typography>
    </Box>
  );
}
