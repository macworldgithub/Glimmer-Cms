import { BACKEND_URL } from "../../config/server";
import axios from "axios";
import { RootState } from "../../store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface UpdateSalonApi {
  salon_name: string;
  owner_name: string;
  about: string;
  owner_contact_email: string;
  contact_number: string;
  openingHour: string;
  closingHour: string;
  email: string;
  password: string;
  address: string;
  salon_image: string;
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
  formData.append("owner_name", data.owner_name);
  formData.append("about", data.about);
  formData.append("owner_contact_email", data.owner_contact_email);
  formData.append("contact_number", data.contact_number);
  formData.append("opeingHour", data.openingHour);
  formData.append("closingHour", data.closingHour);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("address", data.address);
  formData.append("salon_image", data.salon_image);

  const response = await axios.put(`${BACKEND_URL}/salon/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
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
  async (
    payload: {
      page_no: number;
      categoryId: string;
      subCategoryName: string;
      subSubCategoryName?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${BACKEND_URL}/salon-services/getAllServicesForSalon?page_no=${payload.page_no}&categoryId=${payload.categoryId}&subCategoryName=${payload.subCategoryName}&subSubCategoryName=${payload.subSubCategoryName}`,
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

export const getAllServicesForAdmin = createAsyncThunk(
  "getAllServicesForAdmin",
  async (
    payload: {
      page_no: number;
      salonId: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${BACKEND_URL}/salon-services/getAllServicesForAdmin?page_no=${payload.page_no}&salonId=${payload.salonId}`,
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

export const updateServiceDiscount = createAsyncThunk(
  "bulk_update_service_discount",
  async (
    { discountPercentage, id }: { discountPercentage: number; id: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update prices
      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/applyBulkDiscount`,
        { discountPercentage, id },
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

      // Make the API call to update prices
      const response = await axios.patch(
        `${BACKEND_URL}/salon-services/applyDiscounttoSingleService`,
        { discountPercentage, id },
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
  _id: number;
  salon_name: string;
  rating: number;
  reviews: number;
  address: string;
  openingHour: string;
  closingHour: string;
  image1: string;
  about: string;
}
interface GetAllSalonsResponse {
  salons: Salon[];
  total: number;
}
export const getAllSalons = createAsyncThunk<GetAllSalonsResponse, number>(
  "salons/getAllSalons",
  async (page_no: number, { rejectWithValue }) => {
    console.log(page_no);
    try {
      const response = await axios.get(`${BACKEND_URL}/salon/get-all-salon?page_no=${page_no}`);
      console.log(response.data);
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