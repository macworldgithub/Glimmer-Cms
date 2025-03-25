import { createSlice } from "@reduxjs/toolkit";
import { getAdminBookings } from "../api/service/api";

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceDuration: number;
  serviceDescription: string;
  salonId: string;
  categoryId: string;
  categoryName: string;
  subCategoryName: string;
  subSubCategoryName: string;
  isDiscounted: boolean;
  discountPercentage: number;
  actualPrice: number;
  finalPrice: number;
  bookingDate: string;
  paymentMethod: string;
  bookingStatus: string;
  isPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingResponse {
  bookings: Booking[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const initialState: BookingResponse = {
  bookings: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
};

const allBookingSlice = createSlice({
  name: "allBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdminBookings.fulfilled, (state, action) => {
      const { bookings, totalPages } = action.payload;
      state.bookings = bookings;
      state.totalPages = totalPages;
    });
  },
});

export default allBookingSlice;
