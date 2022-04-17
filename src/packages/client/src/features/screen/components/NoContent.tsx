import { Box, Typography } from '@mui/material';

export default function NoContent() {
   return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
         <Typography variant="h4">Aktuell kein Inhalt</Typography>
      </Box>
   );
}
