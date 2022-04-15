import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { wrapForInputRef } from '../../../utils/reat-hook-form-utils';
import { authAction } from '../slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const AuthFormSchema = z.object({ password: z.string().nonempty() });

type AuthForm = z.infer<typeof AuthFormSchema>;

export default function Login() {
   const dispatch = useDispatch();
   const {
      handleSubmit,
      register,
      formState: { isValid },
   } = useForm<AuthForm>({ resolver: zodResolver(AuthFormSchema), mode: 'onChange' });

   const isLoggingIn = useSelector((state: RootState) => state.admin.isLoggingIn);
   const error = useSelector((state: RootState) => state.admin.authError);

   const handleLogin = (data: AuthForm) => {
      dispatch(authAction(data.password));
   };

   return (
      <Box height="100%" width="100%" display="flex" alignItems="center" justifyContent="center">
         <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
               Login
            </Typography>
            <form onSubmit={handleSubmit(handleLogin)}>
               <Box display="flex" flexDirection="row" alignItems="center">
                  <TextField
                     disabled={isLoggingIn}
                     label="Password"
                     type="password"
                     {...wrapForInputRef(register('password'))}
                  />
                  <Button sx={{ ml: 2 }} disabled={!isValid || isLoggingIn} type="submit">
                     Login
                  </Button>
               </Box>
            </form>

            {error && (
               <Typography color="error" sx={{ mt: 2 }}>
                  {error}
               </Typography>
            )}
         </Paper>
      </Box>
   );
}
