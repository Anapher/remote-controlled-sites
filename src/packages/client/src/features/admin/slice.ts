import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { authAsAdmin } from '../../services/auth';

interface AdminState {
   authToken: string | null;
   isLoggingIn: boolean;
   authError: string | null;
}

const initialState: AdminState = {
   authToken: null,
   isLoggingIn: false,
   authError: null,
};

export const adminSlice = createSlice({
   name: 'admin',
   initialState,
   reducers: {
      setToken(state, { payload }: PayloadAction<string | null>) {
         state.authToken = payload;
      },
      setLoggingIn(state, { payload }: PayloadAction<boolean>) {
         state.isLoggingIn = payload;
      },
      setAuthError(state, { payload }: PayloadAction<string | null>) {
         state.authError = payload;
      },
   },
});

export const authAction: (password: string) => ThunkAction<Promise<void>, RootState, any, any> = (password) => {
   return async (dispatch) => {
      dispatch(adminSlice.actions.setLoggingIn(true));
      dispatch(adminSlice.actions.setAuthError(null));
      try {
         const token = await authAsAdmin(password);
         dispatch(adminSlice.actions.setToken(token));
      } catch (error) {
         dispatch(adminSlice.actions.setAuthError((error as any).toString()));
      } finally {
         dispatch(adminSlice.actions.setLoggingIn(false));
      }
   };
};

export default adminSlice.reducer;
