import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createBusiness = createAsyncThunk(
  "business/create",
  async (businessData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      // const form = new FormData();
      // Object.keys(values).forEach((key) => {
      //   form.append(key, values[key]);
      // });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(businessData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          message: errorData.message || "An unknown error occurred.",
        });
      }
      const business = await response.json();
      return business;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const createBranch = createAsyncThunk(
  "business/branch/create",
  async (branchData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      // const form = new FormData();
      // Object.keys(values).forEach((key) => {
      //   form.append(key, values[key]);
      // });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/branches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branchData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({
          message: errorData.message || "An unknown error occurred.",
        });
      }
      const business = await response.json();
      return business;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const getBusinesses = createAsyncThunk(
  "business/all",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      // const form = new FormData();
      // Object.keys(values).forEach((key) => {
      //   form.append(key, values[key]);
      // });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = await response.json();
      return data.rows;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);

const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  businesses: [],
  business: {},
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const authSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    reset: (state) => {
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
      state.business = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBusiness.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createBusiness.fulfilled, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = null;
      state.business = action.payload;
      state.successMessage = "user registered";
    });
    builder.addCase(createBusiness.rejected, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload || "An unknown error occurred. Please try again later.";
    });
    builder.addCase(getBusinesses.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getBusinesses.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.successMessage = null;
      state.businesses = action.payload;
    });
    builder.addCase(getBusinesses.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload || "An unknown error occurred. Please try again later.";
    });
    builder.addCase(createBranch.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createBranch.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.successMessage = null;
      state.branch = action.payload;
    });
    builder.addCase(createBranch.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload || "An unknown error occurred. Please try again later.";
    });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
