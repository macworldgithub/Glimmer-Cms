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
// export const getAllProducts = createAsyncThunk(
//   "getAllProducts",
//   async (
//     payload: { page_no: number; name?: string; category?: string; created_at?: string; storeId?: string },
//     { rejectWithValue, getState }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.Login.token;

//       // Build query parameters dynamically
//       const params = new URLSearchParams();
//       params.append("page_no", payload.page_no.toString());

//       if (payload.name) params.append("name", payload.name);
//       if (payload.category) params.append("category", payload.category);
//       if (payload.created_at) params.append("created_at", payload.created_at);
//       if (payload.storeId) params.append("store", payload.storeId);

//       const response = await axios.get(
//         `${BACKEND_URL}/product/get_all_store_products?${params.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (
    payload: { page_no: number; name?: string; category?: string; created_at?: string; storeId?: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const params = new URLSearchParams();
      params.append("page_no", payload.page_no.toString());

      if (payload.name) params.append("name", payload.name);
      if (payload.category) params.append("category", payload.category);
      if (payload.created_at) params.append("created_at", payload.created_at);
      if (payload.storeId) params.append("store", payload.storeId);

      const endpoint = payload.storeId
        ? `${BACKEND_URL}/product/get_all_products_for_admin`
        : `${BACKEND_URL}/product/get_all_store_products`;

      const response = await axios.get(
        `${endpoint}?${params.toString()}`,
        {
          headers: payload.storeId ? {} : { Authorization: `Bearer ${token}` }, // No token for admin endpoint
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
export const updateProductPrices = createAsyncThunk(
  "bulk_update_product_prices",
  async (
    { discount, productIds }: { discount: number, productIds: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update prices
      const response = await axios.put(
        `${BACKEND_URL}/product/bulk_update_product_prices`,
        { discount, productIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update prices");
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

      product.size.forEach((size, index) => {
        formData.append(`size${index + 1}`, JSON.stringify(size));
      });

      // ✅ Append type objects as separate fields (type1, type2, etc.)
      product.type.forEach((type, index) => {
        formData.append(`type${index + 1}`, JSON.stringify(type));
      });

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
  formData.append("vendor_name", data.vendor_name); 
  formData.append("description", data.description);
  formData.append("store_contact_email", data.store_contact_email);
  formData.append("email", data.email);
  formData.append("country", data.country);
  formData.append("address", data.address);

  // ✅ Only add image if it's a File (not a URL string)
  if (typeof data.store_image !== "string") {
    formData.append("store_image", data.store_image);
  }
 const response = await axios.put(`${BACKEND_URL}/store/updateStore`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const updateTrendingProduct = createAsyncThunk(
  "updateTrendingProduct",
  async (
    { productId, status }: { productId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${productId}/trending-product`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update trending product");
    }
  }
);

export const updateBestSellerProduct = createAsyncThunk(
  "updateBestSellerProduct",
  async (
    { productId, status }: { productId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${productId}/best-seller-product`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update best seller product");
    }
  }
);

export const updateYouMusthaveThisProduct = createAsyncThunk(
  "updateYouMusthaveThisProduct",
  async (
    { productId, status }: { productId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${productId}/you-must-have-product`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update rate");
    }
  }
);

export const getAllProductHighlights = createAsyncThunk<any, { filter?: string }>(
  "salons/getAllProductHighlights",
  async ({ filter }, { rejectWithValue }) => {
    try {
      const query = filter ? `?filter=${filter}` : "";
      const response = await axios.get(`${BACKEND_URL}/admin/product-highlights${query}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch salons");
    }
  }
);

export const getProductRatings = createAsyncThunk(
  "getProductRatings",
  async (productId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/product/ratings?id=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch product ratings");
    }
  }
);

export const updateProductRating = createAsyncThunk(
  "updateProductRating",
  async (
    { ratingId, rating }: { ratingId: string; rating: number },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.put(
        `${BACKEND_URL}/product/update_rating?rating_id=${ratingId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update product rating");
    }
  }

  
);

// Add this new thunk within the api.tsx file, after the existing thunks
export const getAllRatedProducts = createAsyncThunk(
  "getAllRatedProducts",
  async (
    payload: { page_no: number; page_size?: number },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const params = new URLSearchParams();
      params.append("page_no", payload.page_no.toString());
      if (payload.page_size) params.append("page_size", payload.page_size.toString());

      const response = await axios.get(
        `${BACKEND_URL}/product/get_all_rated_products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch rated products");
    }
  }
);