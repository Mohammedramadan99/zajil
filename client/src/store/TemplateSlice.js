import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createTemplate = createAsyncThunk(
  "templates/create",
  async (cardData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      console.log({ state });
      const response = await fetch(
        `http://localhost:3000/businesses/${cardData.params.businessId}/card-templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(cardData.data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log({ errorData });
        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      console.log({ data });
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const getTemplates = createAsyncThunk(
  "templates/all",
  async (cardData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `http://localhost:3000/businesses/1/card-templates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log({ errorData });
        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      console.log({ data });
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);

const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  templates: [],
  template: {},
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const templateSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    reset: (state) => {
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTemplate.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = null;
      state.template = action.payload;
    });
    builder.addCase(createTemplate.rejected, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = action.payload?.errors;
    });
    builder.addCase(getTemplates.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getTemplates.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.templates = action.payload.data;
    });
    builder.addCase(getTemplates.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
    });
  },
});

export const { reset } = templateSlice.actions;

export default templateSlice.reducer;
