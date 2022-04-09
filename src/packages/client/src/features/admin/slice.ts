import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ScreenInfo } from '../../shared/Screen';

interface AdminState {
   screens: ScreenInfo[] | null;
}

const initialState: AdminState = {
   screens: null,
};

export const adminSlice = createSlice({
   name: 'admin',
   initialState,
   reducers: {
      setScreens(state, { payload }: PayloadAction<ScreenInfo[]>) {
         state.screens = payload;
      },
   },
});

export const { setScreens } = adminSlice.actions;

export const selectScreens = (state: RootState) => state.admin.screens;

export default adminSlice.reducer;
