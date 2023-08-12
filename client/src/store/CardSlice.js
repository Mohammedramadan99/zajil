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
export const getCardDetails = createAsyncThunk(
  "card/details",
  async (params, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/card-info/${params.cardId}`,
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
export const AddPointToLoyaltyCard = createAsyncThunk(
  "card/addPoint",
  async (params, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          params.businessId
        }/cards/${params.cardId}/loyalty/add-points`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      // dispatch(getCardDetails({ cardId: params.cardId }));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const ReducePoints = createAsyncThunk(
  "card/reducePoints",
  async (actionData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          actionData.params.businessId
        }/cards/${actionData.params.cardId}/loyalty/update-points`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ points: actionData.points }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      // dispatch(getCardDetails({ cardId: params.cardId }));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const redeemGift = createAsyncThunk(
  "card/redeemGift",
  async (actionData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          actionData.params.businessId
        }/cards/${actionData.params.cardId}/loyalty/redeem-gift`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ giftId: actionData.giftId }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      // dispatch(getCardDetails({ cardId: actionData.params.cardId }));
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const useItems = createAsyncThunk(
  "card/subscription/useItems",
  async (actionData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          actionData.params.businessId
        }/cards/${actionData.params.cardId}/items-subscription/use`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(actionData.body),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      // dispatch(getCardDetails({ cardId: actionData.params.cardId }));
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
  updating: false,
  cardCreated: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    reset: (state) => {
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
      state.cardCreated = null;
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
      state.cardCreated = true;
    });
    builder.addCase(createCard.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.errorMessage = action.payload;
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
    builder.addCase(AddPointToLoyaltyCard.pending, (state, action) => {
      state.updating = true;
      state.errors = null;
    });
    builder.addCase(AddPointToLoyaltyCard.fulfilled, (state, action) => {
      state.updating = false;
      state.errors = null;
      state.card.loyaltyCard.points = action.payload?.data?.points;
    });
    builder.addCase(AddPointToLoyaltyCard.rejected, (state, action) => {
      state.updating = false;
      state.errors = action.payload?.errors;
      state.errorMessage = action.payload;
    });
    builder.addCase(redeemGift.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(redeemGift.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.card.loyaltyCard.points = action.payload?.data?.points;
    });
    builder.addCase(redeemGift.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.errorMessage = action.payload;
    });
    builder.addCase(ReducePoints.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(ReducePoints.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.loading = false;
      state.errors = null;
      state.card.loyaltyCard.points = action.payload?.data?.points;
    });
    builder.addCase(ReducePoints.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.errorMessage = action.payload;
    });
  },
});

export const { reset } = cardSlice.actions;

export default cardSlice.reducer;
