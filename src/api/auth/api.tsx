// authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer,BACKEND_URL } from "../../config/server";

// Async thunk for signup
export const signInStore = createAsyncThunk(
  "auth/signupStore",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signin/store`,
        payload
      );
      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
