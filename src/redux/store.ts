import { configureStore } from "@reduxjs/toolkit";
import cvDataReducer from "./cvDataSlice";

export const store = configureStore({
  reducer: {
    cvData: cvDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
