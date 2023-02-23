import { createSlice } from '@reduxjs/toolkit';

interface UserInteractionState {
   hadInteraction: boolean;
}

const initialState: UserInteractionState = {
   hadInteraction: false,
};

export const adminSlice = createSlice({
   name: 'user-interaction',
   initialState,
   reducers: {
      hadUserInteraction(state) {
         state.hadInteraction = true;
      },
   },
});

export const { hadUserInteraction } = adminSlice.actions;

export default adminSlice.reducer;
