import { configureStore } from "@reduxjs/toolkit";

import loginSlice from "../slices/loginSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage)
import { PersistConfig } from "redux-persist";

const persistConfig: PersistConfig<any> = {
  key: "glimmer", // Key for storage
  storage, // Default storage for web
};

const persistedReducer = persistReducer(persistConfig, loginSlice.reducer);

export const store = configureStore({
  reducer: {
    Login: persistedReducer,
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
