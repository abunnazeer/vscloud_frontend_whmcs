// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import registrarReducer from "./slices/registrarSlice";

export const store = configureStore({
  reducer: {
    registrars: registrarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
