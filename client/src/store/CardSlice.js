import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../utils/Api";

export const createCard = createAsyncThunk(
  "card/create",
  async (cardData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `http://localhost:3000/businesses/${cardData.params.businessId}/cards`,
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
  "card/all",
  async (businessId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${baseUrl}/businesses/${businessId}/card-templates`,
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
  cards: null,
  card: null,
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    reset: (state) => {
      state.card = null;
      state.cards = null;
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCard.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createCard.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.card = action.payload.data;
    });
    builder.addCase(createCard.rejected, (state, action) => {
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
      state.cards = action.payload.data;
    });
    builder.addCase(getTemplates.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
    });
  },
});

export const { reset } = cardSlice.actions;

export default cardSlice.reducer;
