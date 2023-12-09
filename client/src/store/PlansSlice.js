import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createPlan = createAsyncThunk(
  "plan/create",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      //   const form = new FormData();
      //   Object.keys(values).forEach((key) => {
      //     form.append(key, values[key]);
      //   });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/plans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actionData),
      });
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
export const getPlans = createAsyncThunk(
  "plan/all",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/plans`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
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
export const getEventsPlans = createAsyncThunk(
  "plan/events-plans",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/plans/event/get-all-plans`,
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
export const getPlan = createAsyncThunk(
  "plan/details",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/plans/${id}`,
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
export const updatePlan = createAsyncThunk(
  "plan/update",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/plans/${actionData.params.id}`,
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
export const deletePlan = createAsyncThunk(
  "plan/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/plans/${id}`,
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
  allPlans: null,
  eventsPlans: null,
  planDetails: null,
  deleted: false,
  updated: false,
  loading: false,
  errors: null,
};
const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    reset: (state) => {
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
      state.deleted = false;
      state.updated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPlan.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.business = action.payload.data;
    });
    builder.addCase(createPlan.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload.message ||
        "An unknown error occurred. Please try again later.";
    });
    builder.addCase(getPlans.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.allPlans = action.payload.data;
    });
    builder.addCase(getPlans.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload.message ||
        "An unknown error occurred. Please try again later.";
    });
    builder.addCase(getEventsPlans.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getEventsPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.eventsPlans = action.payload.data;
    });
    builder.addCase(getEventsPlans.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload.message ||
        "An unknown error occurred. Please try again later.";
    });
  },
});

export const { reset } = planSlice.actions;

export default planSlice.reducer;
