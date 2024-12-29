import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Authentication {
  isAuthenticated: boolean;
}

const initialState: Authentication = {
  isAuthenticated: true,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    changeAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { changeAuthentication } = loginSlice.actions;
export default loginSlice;
