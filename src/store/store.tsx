import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../slices/loginSlice";
import allProductsSlice from "../slices/allProductSlice";
import addProductSlice from "../slices/addProductSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage)
import { PersistConfig } from "redux-persist";
import { combineReducers } from "redux"; // Combine multiple reducers

// Combine reducers
const rootReducer = combineReducers({
  Login: loginSlice.reducer,
  AllProducts: allProductsSlice.reducer,
  AddProduct: addProductSlice.reducer,
});

// Type for the root reducer
type RootReducerType = ReturnType<typeof rootReducer>;

// Configure persist
const persistConfig: PersistConfig<any> = {
  key: "glimmer", // Key for storage
  storage, // Default storage for web
};

const persistedReducer = persistReducer<RootReducerType>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
