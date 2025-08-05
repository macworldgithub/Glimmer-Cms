import { createSlice } from "@reduxjs/toolkit";
import { 
  approveBooking, 
  getAdminBookings, 
  getSalonBookings, 
  rejectBooking, 
  getBookingDetailsById, 
  updateApprovedBookingStatus
} from "../api/service/api";

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
  bookingTime: string;
  paymentMethod: string;
  bookingStatus: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingResponse {
  bookings: Booking[];
  total: number;
  currentPage: number;
  totalPages: number;
  details: Booking | null;  // Store booking details when fetched
}

const initialState: BookingResponse = {
  bookings: [],
  total: 0,
  currentPage: 1,
  totalPages: 0,
  details: null,
};

// Function to remove a booking from the list
const removeBookingFromList = (bookings: Booking[], bookingId: string): Booking[] => {
  return bookings.filter((booking) => booking._id !== bookingId);
};

const updateBookingStatusInList = (bookings: Booking[], bookingId: string, newStatus: string): Booking[] => {
  return bookings.map((booking) =>
    booking._id === bookingId ? { ...booking, bookingStatus: newStatus } : booking
  );
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
    builder.addCase(getSalonBookings.fulfilled, (state, action) => {
      const { bookings, totalPages } = action.payload;
      state.bookings = bookings;
      state.totalPages = totalPages;
    });
    builder.addCase(approveBooking.fulfilled, (state, action) => {
      const approvedBooking = action.payload;
      state.bookings = removeBookingFromList(state.bookings, approvedBooking._id);
    });
    builder.addCase(rejectBooking.fulfilled, (state, action) => {
      const rejectedBooking = action.payload;
      state.bookings = removeBookingFromList(state.bookings, rejectedBooking._id);
    });
    builder.addCase(getBookingDetailsById.fulfilled, (state, action) => {
      state.details = action.payload; 
    });
    builder.addCase(updateApprovedBookingStatus.fulfilled, (state, action) => {
      const { bookingId, bookingStatus } = action.payload;
      state.bookings = updateBookingStatusInList(state.bookings, bookingId, bookingStatus);
      if (state.details && state.details._id === bookingId) {
        state.details.bookingStatus = bookingStatus;
      }
    });
  },
});

export default allBookingSlice;
