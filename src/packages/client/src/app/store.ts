import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/slice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
