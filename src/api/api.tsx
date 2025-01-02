// authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const development_url = "http://localhost:3000";
const production_url = "";

// Async thunk for signup
export const signInStore = createAsyncThunk(
  "auth/signupStore",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${development_url}/auth/signin/store`,
        payload
      );
      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
