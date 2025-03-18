// authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer, BACKEND_URL } from "../../config/server";

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

export const signInSalon = createAsyncThunk(
  "auth/signInSalon",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signin/salon`,
        payload
      );
      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const signInAdmin = createAsyncThunk(
  "auth/signInAdmin",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signin/admin`,
        payload
      );
      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const createStore = async (form: FormData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/signup/store`, form, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for sending FormData
      },
    });
    return res.data; // Return the response data
  } catch (error) {
    console.error("Error creating store:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};

export const createSalon = async (form: FormData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/signup/salon`, form, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for sending FormData
      },
    });
    return res.data; // Return the response data
  } catch (error) {
    console.error("Error creating store:", error);
    throw error; // Re-throw the error to handle it in the caller
  }
};
