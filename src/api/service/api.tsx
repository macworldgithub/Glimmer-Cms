import { BACKEND_URL } from "../../config/server";
import axios from "axios";
import { RootState } from "../../store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";



export interface UpdateSalonApi {
  salon_name: string;
  about: string;
  contact_number: string;
  openingHour: string;
  closingHour: string;
  email: string;
  address: string;
  salon_image?: File | string; // Make salon_image optional and allow File type
  password?: string; // Make password optional
}
export const getAllServices = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/salon-services-categories/getCategoryName`
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const getAllServicesById = async (category_id) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/salon-services-categories/getCategryById/${category_id}`
    );
    return res.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export const createService = createAsyncThunk(
  "createService",
  async (
    data: { category: string; services: Record<string, string[]> },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.post(
        `${BACKEND_URL}/salon-services-categories/create`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create service");
    }
  }
);

export const updateService = createAsyncThunk(
  "update",
  async (
    { category_id, data }: { category_id: string; data: any },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/salon-services-categories/update/${category_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update");
    }
  }
);

export const deleteService = createAsyncThunk(
  "delete",
  async (
    { category_id }: { category_id: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const res = await axios.delete(
        `${BACKEND_URL}/salon-services-categories/delete/${category_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update");
    }
  }
);


export const updateSalonApi = async (token: string, data: UpdateSalonApi) => {
  const formData = new FormData();
  formData.append("salon_name", data.salon_name);
  formData.append("about", data.about);
  formData.append("contact_number", data.contact_number);
  formData.append("openingHour", data.openingHour); // Fix typo if present
  formData.append("closingHour", data.closingHour);
  formData.append("email", data.email);
  formData.append("address", data.address);
  if (data.salon_image instanceof File) {
    formData.append("image1", data.salon_image); // Send as image1
  }

  try {
    const response = await axios.put(`${BACKEND_URL}/salon/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in updateSalonApi:", error.response?.data || error.message);
    throw error;
  }
};
export const addSalonApi = createAsyncThunk(
  "addSalon",
  async (payload: {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const salon = state.AddSalon;
      console.log(salon);

      // Construct FormData
      const formData = new FormData();
      formData.append("name", salon.name);
      formData.append("description", salon.description);
      formData.append("duration", salon.duration.toString());
      formData.append("requestedPrice", salon.requestedPrice.toString());
      formData.append("base_price", salon.base_price.toString());
      formData.append(
        "discounted_price",
        salon.discounted_price ? salon.discounted_price.toString() : "0"
      );
      formData.append("status", salon.status);
      formData.append("categoryId", salon.categoryId);
      formData.append("subCategoryName", salon.subCategoryName);
      formData.append("subSubCategoryName", salon.subSubCategoryName);

      // @ts-ignore
      salon.images.forEach((file: File, index: number) => {
        formData.append(`image${index + 1}`, file);
      });

      // Make API request
      const response = await axios.post(
        `${BACKEND_URL}/salon-services/createService`,
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

export const getAllServicesForSalon = createAsyncThunk(
  "getAllServicesForSalon",
  async (params: GetSalonBookingsParams, { rejectWithValue, getState }) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;
      console.log(token);

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${BACKEND_URL}/salon-services/getAllServicesForSalon`,
        {
          params: {
            page_no: params.page_no,
            ...(params.status && { status: params.status }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.subCategoryName && {
              subCategoryName: params.subCategoryName,
            }),
            ...(params.subSubCategoryName && {
              subSubCategoryName: params.subSubCategoryName,
            }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateSalonServiceApi = createAsyncThunk(
  "updateSalonServiceApi",
  async (
    payload: {
      id: string;
      name: string;
      description: string;
      duration: number;
      images: string[];
      requestedPrice: number;
      base_price: number;
      discounted_price: number;
      status: "Active" | "Inactive";
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
        `${BACKEND_URL}/salon-services/updateServiceById`,
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

interface GetAdminServicesParams {
  page_no: number;
  salonId?: string;
  categoryId?: string;
  name?: string;
}

export const getAllServicesForAdmin = createAsyncThunk(
  "getAllServicesForAdmin",
  async (params: GetAdminServicesParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/salon-services/getAllServicesForAdmin`,
        {
          params: {
            page_no: params.page_no,
            ...(params.salonId && { salonId: params.salonId }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.name && { name: params.name }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const requestPriceUpdate = createAsyncThunk(
  "request_price_update",
  async (
    { requestedPrice, id }: { requestedPrice: number; id: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update prices
      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/requestPriceUpdate`,
        { requestedPrice, id },
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

export const approvePriceUpdate = createAsyncThunk(
  "approve_price_update",
  async (
    { adminSetPrice, id }: { adminSetPrice: number; id: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update prices
      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/approvePriceUpdate`,
        { adminSetPrice, id },
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


export const updateSingleServiceDiscount = createAsyncThunk(
  "bulk_update_single_service_discount",
  async (
    { discountPercentage, id }: { discountPercentage: number; id: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/applyDiscounttoSingleService`,
        { discountPercentage, id },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 seconds timeout
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update discount");
    }
  }
);

export const updateServiceDiscount = createAsyncThunk(
  "bulk_update_service_discount",
  async (
    { discountPercentage, id }: { discountPercentage: number; id: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/applyBulkDiscount`,
        { discountPercentage, id },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 seconds timeout
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update discounts");
    }
  }
)

export const deleteServiceApi = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/salon-services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer token
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the response data if successful
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data); // Throw error with response data
    }
    throw new Error("An error occurred"); // Generic error
  }
};

interface GetAdminBookingsParams {
  page_no: number;
  salonId?: string;
  categoryId?: string;
  subCategoryName?: string;
  subSubCategoryName?: string;
  name?: string;
  customerName?: string;
  serviceName?: string;
}

export const getAdminBookings = createAsyncThunk(
  "getAdminBookings",
  async (params: GetAdminBookingsParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/salon-service-bookings/getAllBookingForAdmin`,
        {
          params: {
            page: params.page_no,
            ...(params.salonId && { salonId: params.salonId }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.subCategoryName && {
              subCategoryName: params.subCategoryName,
            }),
            ...(params.subSubCategoryName && {
              subSubCategoryName: params.subSubCategoryName,
            }),
            ...(params.name && {
              name: params.name,
            }),
            ...(params.customerName && {
              customerName: params.customerName,
            }),
            ...(params.serviceName && {
              serviceName: params.serviceName,
            }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

interface GetSalonBookingsParams {
  page_no: number;
  status?: string;
  categoryId?: string;
  subCategoryName?: string;
  subSubCategoryName?: string;
  customerName?: string;
  serviceName?: string;
}
export const getSalonBookings = createAsyncThunk(
  "getSalonBookings",
  async (params: GetSalonBookingsParams, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/salon-service-bookings/getAllSalonBooking`,
        {
          params: {
            page: params.page_no,
            limit: 8,
            ...(params.status && { status: params.status }),
            ...(params.categoryId && { categoryId: params.categoryId }),
            ...(params.subCategoryName && {
              subCategoryName: params.subCategoryName,
            }),
            ...(params.subSubCategoryName && {
              subSubCategoryName: params.subSubCategoryName,
            }),
            ...(params.customerName && {
              customerName: params.customerName,
            }),
            ...(params.serviceName && {
              serviceName: params.serviceName,
            }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const approveBooking = createAsyncThunk(
  "approve_booking",
  async (
    { bookingId }: { bookingId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update booking
      const response = await axios.put(
        `${BACKEND_URL}/salon-service-bookings/approveBooking?bookingId=${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to approve booking"
      );
    }
  }
);

export const rejectBooking = createAsyncThunk(
  "reject_booking",
  async (
    { bookingId }: { bookingId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update booking
      const response = await axios.put(
        `${BACKEND_URL}/salon-service-bookings/rejectBooking?bookingId=${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to reject booking"
      );
    }
  }
);

export const getBookingDetailsById = createAsyncThunk(
  "getBookingDetailsById",
  async (
    { bookingId }: { bookingId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${BACKEND_URL}/salon-service-bookings/getbookingDetailsById?bookingId=${bookingId}`,
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

export const updateApprovedBookingStatus = createAsyncThunk(
  "updateApprovedBookingStatus",
  async (
    { bookingId, bookingStatus }: { bookingId: string; bookingStatus: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update booking
      const response = await axios.put(
        `${BACKEND_URL}/salon-service-bookings/updateApprovedBookingStatus`,
        {
          bookingId,
          bookingStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to reject booking"
      );
    }
  }
);

export const deleteBookingApi = async (bookingId: string, token: string) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/salon-service-bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer token
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the response data if successful
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data); // Throw error with response data
    }
    throw new Error("An error occurred"); // Generic error
  }
};

interface Salon {
  _id: string;
  name: string;
  description: string;
  duration: number;
  images: { name: string; url: string }[];
  requestedPrice: number;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive"; // Enum-like string literals
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;

  newToGlimmer?: boolean;
  trendingSalon?: boolean;
  recommendedSalon?: boolean;
}

interface GetAllSalonsResponse {
  salons: Salon[];
  total: number;
}
interface GetAllSalonsParams {
  page_no: number;
  salon_name?: string;
}

export const getAllSalons = createAsyncThunk<GetAllSalonsResponse, GetAllSalonsParams>(
  "salons/getAllSalons",
  async ({ page_no, salon_name }, { rejectWithValue }) => {
    try {
      let url = `${BACKEND_URL}/salon/get-all-salon?page_no=${page_no}`;
      if (salon_name) {
        url += `&salon_name=${encodeURIComponent(salon_name)}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch salons");
    }
  }
);

export const changeActivationStatus = createAsyncThunk(
  "changeActivationStatus",
  async (
    { id }: { id: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update booking
      const response = await axios.get(
        `${BACKEND_URL}/salon-services/changeActivationStatus?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to approve booking"
      );
    }
  }
);

export const getAllProducts = async (
  category?: string,
  subcategory?: string,
  item?: string,
  page?: number
) => {
  try {
    // Start building the URL with the base endpoint
    let url = `${BACKEND_URL}/product/get_all_products?page_no=${page || 1}`;

    // Add filters to the URL only if they are provided
    if (category) url += `&category=${category}`;
    if (subcategory) url += `&sub_category=${subcategory}`;
    if (item) url += `&item=${item}`;

    // Make the API request with the dynamically constructed URL
    const res = await axios.get(url);

    return res.data; // Return the response data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Throw error to handle it in the calling function
  }
};

export const addRecommendedProduct = async (
  salonId: string,
  productId: string,
  productName: string,
) => {
  try {
    const url = `${BACKEND_URL}/admin/add-recommended-products/${salonId}`;

    const res = await axios.post(url, { productId, productName });

    return res.data; // Return the response data
  } catch (error) {
    console.error("Error adding recommended product:", error);
    throw error; // Propagate error for handling in the calling function
  }
};

export const getAllRecommendedProductsForSalon = createAsyncThunk(
    "admin/get-recommended-products-of-salon",
    async (salonId: string, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.Login.token;

        const response = await axios.get(
          `${BACKEND_URL}/admin/get-recommended-products-of-salon/${salonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch recommended products");
      }
    }
  );

  export const getAllRecommendedProducts = createAsyncThunk(
    "admin/recommended-products",
    async (salonId: string, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.Login.token;

        const response = await axios.get(
          `${BACKEND_URL}/admin/get-recommended-products-of-salon/${salonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch recommended products");
      }
    }
  );

  export const getRecommendedProductsForSalon = createAsyncThunk(
    "admin/get-recommended-products-of-salon",
    async (salonId: string, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.Login.token;

        const response = await axios.get(
          `${BACKEND_URL}/admin/get-recommended-products-of-salon/${salonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch recommended products");
      }
    }
  );

  export const getRecommendedProducts = createAsyncThunk(
    "admin/recommended-products",
    async (salonId: string, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.Login.token;

        const response = await axios.get(
          `${BACKEND_URL}/admin/get-recommended-products-of-salon/${salonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch recommended products");
      }
    }
  );

export const createSaleRecordForSalonCut = async (
  salonId: string,
  productId: string,
  quantity: number,
  price: number,
  salonCut: number
) => {
  try {
    const url = `${BACKEND_URL}/admin/create-sale-record-for-salon-cut/${salonId}/${productId}`;

    const res = await axios.post(url, {
      quantity,
      price,
      salonCut
    });

    return res.data; // Return the response data
  } catch (error) {
    console.error("Error creating sale record for salon cut:", error);
    throw error; // Propagate error for handling in the calling function
  }
};

export const updateRateOfSalon = createAsyncThunk(
  "update_rate_of_salon",
  async (
    { salonId, productId, newRate }: { salonId: string; productId: string; newRate: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/update-rate-of-salon/${salonId}/${productId}`,
        { newRate },
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

export const deleteRecommendedProductOfSalon = async (
  salonId: string,
  productId: string
) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/admin/delete-recommended-products-of-salon/${salonId}/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error("An error occurred");
  }
};

interface Store {
  _id: string;
  store_name: string;
  vendor_name: string;
  description: string;
  store_contact_email: string;
  email: string;
  country: string;
  address: string;
  store_image: string | null;
  created_at: string;
}

interface GetAllStoresResponse {
  stores: Store[];
  total: number;
}

interface GetAllStoresParams {
  page_no: number;
  store_name?: string;
}

export const getAllStores = createAsyncThunk<GetAllStoresResponse, GetAllStoresParams>(
  "stores/getAllStores",
  async ({ page_no, store_name }, { rejectWithValue, getState }) => {
    try {
      console.log("111")
      const state = getState() as RootState;
      const token = state.Login.token;

      let url = `${BACKEND_URL}/store/get_all_stores?page_no=${page_no || 1}`;
      console.log(url)
      if (store_name) {
        url += `&store_name=${encodeURIComponent(store_name)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch stores");
    }
  }
);

export const updateNewToGlimmer = createAsyncThunk(
  "update-new-to-glimmer",
  async (
    { salonId, status }: { salonId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${salonId}/new-to-glimmer`,
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

export const updateTrendingSalon = createAsyncThunk(
  "update-trending-salon",
  async (
    { salonId, status }: { salonId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${salonId}/trending-salon`,
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

export const updateRecommendedSalon = createAsyncThunk(
  "update-recommended-salon",
  async (
    { salonId, status }: { salonId: string; status: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.patch(
        `${BACKEND_URL}/admin/${salonId}/recommended-salon`,
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

export const getAllSalonsHighlights = createAsyncThunk<any, { filter?: string }>(
  "salons/getAllSalonsHighlights",
  async ({ filter }, { rejectWithValue }) => {
    try {
      const query = filter ? `?filter=${filter}` : "";
      const response = await axios.get(`${BACKEND_URL}/admin/salon-highlights${query}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch salons");
    }
  }
);