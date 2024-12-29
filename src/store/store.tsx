import { configureStore } from "@reduxjs/toolkit";

import loginSlice from "../slices/loginSlice";

export const store = configureStore({
  reducer: {
    Login: loginSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
