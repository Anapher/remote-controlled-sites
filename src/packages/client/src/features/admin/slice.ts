import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ScreenDto } from "../../shared/Screen";
import { RootState } from "../../app/store";

interface AdminState {
  screens: ScreenDto[] | null;
}

const initialState: AdminState = {
  screens: null,
};

export const counterSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setScreens(state, { payload }: PayloadAction<ScreenDto[]>) {
      state.screens = payload;
    },
  },
});

export const { setScreens } = counterSlice.actions;

export const selectScreens = (state: RootState) => state.admin.screens;

export default counterSlice.reducer;
