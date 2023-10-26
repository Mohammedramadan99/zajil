import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateBusinesses } from "./authSlice";

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (actionData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      //   const form = new FormData();
      //   Object.keys(values).forEach((key) => {
      //     form.append(key, values[key]);
      //   });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/plans/subscribe/${
          actionData.params.businessId
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actionData.data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue({
          message: errorData?.data.message || "An unknown error occurred.",
        });
      }
      const data = await response.json();
      dispatch(updateBusinesses(data.data));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const getSubscriptions = createAsyncThunk(
  "Subscription/all",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Subscriptions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue({
          message: errorData?.data.message || "An unknown error occurred.",
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const getSubscription = createAsyncThunk(
  "Subscription/details",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Subscriptions/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue({
          message: errorData?.data.message || "An unknown error occurred.",
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const updateSubscription = createAsyncThunk(
  "Subscription/update",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Subscriptions/${actionData.params.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actionData.data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue({
          message: errorData?.data.message || "An unknown error occurred.",
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const deleteSubscription = createAsyncThunk(
  "Subscription/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Subscriptions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue({
          message: errorData?.data.message || "An unknown error occurred.",
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);

const initialState = {
  subscriptionDetails: null,
  deleted: false,
  updated: false,
  success: false,
  loading: false,
  errors: null,
};
const SubscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    reset: (state) => {
      state.errors = null;
      state.errorMessage = null;
      state.success = false;
      state.errors = null;
      state.deleted = false;
      state.updated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSubscription.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.subscriptionDetails = action.payload.data;
      state.success = true;
    });
    builder.addCase(createSubscription.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload.message ||
        "An unknown error occurred. Please try again later.";
    });
  },
});

export const { reset } = SubscriptionSlice.actions;

export default SubscriptionSlice.reducer;
