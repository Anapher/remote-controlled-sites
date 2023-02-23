import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/admin/slice';
import userInteractionReducer from '../features/user-interaction//slice';

export const store = configureStore({
   reducer: {
      admin: adminReducer,
      userInteraction: userInteractionReducer,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
