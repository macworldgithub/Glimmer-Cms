import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux"; // Combine multiple reducers
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage (localStorage)
import addProductSlice from "../slices/addProductSlice";
import allProductsSlice from "../slices/allProductSlice";
import loginSlice from "../slices/loginSlice";
import orderSlice from "../slices/orderSlice";
import allOrderSlice from "../slices/orderSlice";

// Combine reducers
const rootReducer = combineReducers({
  Login: loginSlice.reducer,
  AllProducts: allProductsSlice.reducer,
  AddProduct: addProductSlice.reducer,
  // Orders: orderSlice.reducer,
  AllOrders: allOrderSlice.reducer,
});

// Type for the root reducer
type RootReducerType = ReturnType<typeof rootReducer>;

// Configure persist
const persistConfig: PersistConfig<any> = {
  key: "glimmer", // Key for storage
  storage, // Default storage for web
  blacklist: ["AddProduct", "AllProducts", "AllOrders"],
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
