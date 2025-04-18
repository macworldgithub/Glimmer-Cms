import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addSalonApi, approvePriceUpdate, requestPriceUpdate } from "../api/service/api";

export interface Service {
  _id?: string;
  name: string;
  description: string;
  duration: number;
  images: string[];
  requestedPrice: number;
  adminSetPrice?: number;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive"; // Enum-like string literals
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
}

const initialState: Service = {
  _id: "",
  name: "",
  description: "",
  duration: 0,
  images: [],
  requestedPrice: 0,
  base_price: 0,
  discounted_price: 0,
  status: "Active",
  categoryId: "",
  subCategoryName: "",
  subSubCategoryName: "",
};

const addSalonSlice = createSlice({
  name: "addSalon",
  initialState,
  reducers: {
    addImages: (state, action) => {
      if (state.images.length + action.payload.length <= 3) {
        state.images.push(...action.payload); // Add new images
      } else {
        alert("You can only upload up to 5 images.");
      }
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(
        (_, index) => index !== action.payload
      ); // Remove image by index
    },
    updateSalon(state, action: PayloadAction<Partial<Service>>) {
      return { ...state, ...action.payload };
    },
    resetImage: (state) => {
      state.images = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(addSalonApi.fulfilled, () => {
      alert("Success : Service Added");
      return initialState; // Correct way to reset the state
    });
    builder.addCase(addSalonApi.rejected, (e, d) => {
      console.log(e, "e idhr hai", d);
      //@ts-ignore
      alert("Error: " + (d?.payload?.message ? d?.payload?.message[0] : "!"));
      return;
    });
    builder.addCase(requestPriceUpdate.fulfilled, (state, action) => {
      const { serviceId, price } = action.payload;
      if (state._id === serviceId) {
        state.requestedPrice = price;
      }
    });
    builder.addCase(approvePriceUpdate.fulfilled, (state, action) => {
      const { serviceId, price } = action.payload;
      if (state._id === serviceId) {
        state.adminSetPrice = price;
      }
    });
  },
});

export const { updateSalon, addImages, removeImage, resetImage } =
  addSalonSlice.actions;
export default addSalonSlice;
