import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// delete user
export const registerAction = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    //get user token
    console.log({ userData });
    //http call
    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        //   credentials: "include",
        body: userData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error;
      state.user = null;
    });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
