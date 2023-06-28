import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { API } from "../utils/config";

export const createCard = createAsyncThunk(
  "card/create",
  async (cardData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          cardData.params.businessId
        }/cards`,
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
export const getCards = createAsyncThunk(
  "card/all",
  async (businessId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${businessId}/cards`,
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
export const getCardDetails = createAsyncThunk(
  "card/details",
  async (params, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          params.businessId
        }/cards/${params.cardId}`,
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
    builder.addCase(getCards.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getCards.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.cards = action.payload.data;
    });
    builder.addCase(getCards.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
    });
    builder.addCase(getCardDetails.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(getCardDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.card = action.payload.data;
    });
    builder.addCase(getCardDetails.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
    });
  },
});

export const { reset } = cardSlice.actions;

export default cardSlice.reducer;
