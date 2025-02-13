import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer, BACKEND_URL } from "../../config/server";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
export interface UpdateStoreApi {
  store_name: string;
  vendor_name: string;
  description: string;
  store_contact_email: string;
  email: string;
  country: string;
  address: string;
  store_image: string;
}

// Async thunk for signup
export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (payload: { page_no: number, name: string, category: string, created_at?: string }, { rejectWithValue, getState }) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${BACKEND_URL}/product/get_all_store_products?page_no=${payload.page_no}&name=${payload.name}&category=${payload.category}&created_at=${payload.created_at}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// export const addProductApi = createAsyncThunk(
//   "addProduct",
//   async (payload: {}, { rejectWithValue, getState }) => {
//     try {
//       // Access token from the Redux state
//       const state = getState() as RootState;
//       const token = state.Login.token;

//       const product = state.AddProduct;

//       // Make API request with page number as a query parameter
//       const response = await axios.post(
//         `${BACKEND_URL}/product/create`,
//         product,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add Bearer token
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response.data; // Return the response data if successful
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

export const addProductApi = createAsyncThunk(
  "addProduct",
  async (payload: {}, { rejectWithValue, getState }) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      const product = state.AddProduct;

      // Construct FormData
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("quantity", product.quantity.toString());
      formData.append("description", product.description);
      formData.append("base_price", product.base_price.toString());
      formData.append(
        "discounted_price",
        product.discounted_price ? product.discounted_price.toString() : "0"
      );
      formData.append("status", product.status);
      formData.append("category", product.category);
      formData.append("sub_category", product.subcategory);
      formData.append("item", product.item);

      // Append images to FormData
      // @ts-ignore
      product.images.forEach((file: File, index: number) => {
        formData.append(`image${index + 1}`, file);
      });

      // Make API request
      const response = await axios.post(
        `${BACKEND_URL}/product/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "result");

      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateProductApi = createAsyncThunk(
  "updateProduct",
  async (
    payload: {
      name: string;
      quantity: number;
      description: string;
      images: string[];
      base_price: number;
      discounted_price: number;
      status: "Active" | "Inactive";
      store: string;
      _id: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      const body = { ...payload } as any;
      // Remove the store property

      // Make API request with the payload
      const response = await axios.put(
        `${BACKEND_URL}/product/update_store_product_by_id?id=${body._id}`,
        body, // Use the payload directly
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      // Handle error response properly
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const deleteProductApi = async (_id: string, token: string) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/product/delete_store_product_by_id?id=${_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data if successful
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data); // Throw error with response data
    }
    throw new Error("An error occurred"); // Generic error
  }
};

export const updateStoreApi = async (token: string, data: UpdateStoreApi) => {
  const formData = new FormData();

  formData.append("store_name", data.store_name);
  formData.append("verndor_name", data.vendor_name);
  formData.append("description", data.description);
  formData.append("store_contact_email", data.store_contact_email);
  formData.append("email", data.email);
  formData.append("country", data.country);
  formData.append("address", data.address);
  formData.append("store_image", data.store_image);

  const response = await axios.put(
    `${BACKEND_URL}/store/update_store`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
