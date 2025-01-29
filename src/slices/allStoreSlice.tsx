import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllStores } from "../api/store/api";
import { useDispatch } from "react-redux";
interface Store {
    store_name: string;
    description: string;
    email: string;
    _id: string;
}

interface AllStores {
    stores: Store[];
    page: number;
}

const initialState: AllStores = {
    stores: [],
    page: 1,
};

const allStoresSlice = createSlice({
    name: "allStores",
    initialState,
    reducers: {
        addToStoreList: (state, action: PayloadAction<Store>) => {
            state.stores.push(action.payload);
        },
    },
    extraReducers(builder) {
        builder.addCase(getAllStores.fulfilled, (state, action) => {
            state.stores = action.payload.stores; // Extracting only the stores array
        });
    },
});

export const { addToStoreList } = allStoresSlice.actions;
export default allStoresSlice;