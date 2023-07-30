import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCards = createAsyncThunk(
  "stats/cards",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/statistics/cards`,
        {
          method: "GET",
          headers: {
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
export const getCardsCount = createAsyncThunk(
  "stats/cardsCount",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/statistics/cards/total`,
        {
          method: "GET",
          headers: {
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
export const getCardsChart = createAsyncThunk(
  "stats/cardsChart",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      console.log({actionData})
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/statistics/cards/chart?startDate=${
          actionData.firstDay
        }&endDate=${actionData.lastDay}&nPoints=${
          actionData.nPoints
        }&businessId=${actionData.businessId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.data.message);
      }
      const data = await response.json();
      return {data,last10Days:actionData.last10Days};
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const GetCardsRedeemedRewardsChart = createAsyncThunk(
  "stats/cardsRedeemedRewardsChart",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/statistics/cards/rewards-redeemed/chart?startDate=${
          actionData.startDate
        }&endDate=${actionData.endDate}&nPoints=${
          actionData.nPoints
        }&businessId=${actionData.businessId}`,
        {
          method: "GET",
          headers: {
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
export const getActivities = createAsyncThunk(
  "stats/getActivities",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/statistics/activities?businessId=${
          actionData.businessId
        }`,
        {
          method: "GET",
          headers: {
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
export const getActivitiesChart = createAsyncThunk(
  "stats/getActivitiesChart",
  async (actionData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/statistics/activities/chart?startDate=${
          actionData.startDate
        }&endDate=${actionData.endDate}&nPoints=${
          actionData.nPoints
        }&businessId=${actionData.businessId}`,
        {
          method: "GET",
          headers: {
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

const initialState = {
  loadingCards: false,
  loadingCardsChart: false,
  loadingCardsCount: false,
  loadingActivities: false,
  loadingActivitiesChart: false,
  error: null,
  cards: null,
  cardsCount: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    reset: () => {
      error: null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCards.pending, (state, action) => {
      state.loadingCards = true;
    });
    builder.addCase(getCards.fulfilled, (state, action) => {
      state.loadingCards = false;
      state.cards = action.payload.data;
    });
    builder.addCase(getCards.rejected, (state, action) => {
      state.loadingCards = false;
      state.error = action.payload.error;
    });
    builder.addCase(getCardsCount.pending, (state, action) => {
      state.loadingCardsCount = true;
    });
    builder.addCase(getCardsCount.fulfilled, (state, action) => {
      state.loadingCardsCount = false;
      state.cardsCount = action.payload.data;
    });
    builder.addCase(getCardsCount.rejected, (state, action) => {
      state.loadingCardsCount = false;
      state.error = action.payload.error;
    });
    builder.addCase(getCardsChart.pending, (state, action) => {
      state.loadingCardsChart = true;
    });
    builder.addCase(getCardsChart.fulfilled, (state, action) => {
      const points = action.payload.data.data
      const dates = action.payload.last10Days
      const combinedArray = dates.reduce((acc, date, index) => {
        return [...acc, { point: points[index], date: date }];
      }, []);
      state.loadingCardsChart = false;
      state.cardsChart = combinedArray;
    });
    builder.addCase(getCardsChart.rejected, (state, action) => {
      state.loadingCardsChart = false;
      state.error = action.payload.error;
    });
    builder.addCase(getActivities.pending, (state, action) => {
      state.loadingActivities = true;
    });
    builder.addCase(getActivities.fulfilled, (state, action) => {
      state.loadingActivities = false;
      state.activities = action.payload.data;
    });
    builder.addCase(getActivities.rejected, (state, action) => {
      state.loadingActivities = false;
      state.error = action.payload.error;
    });
    builder.addCase(getActivitiesChart.pending, (state, action) => {
      state.loadingActivitiesChart = true;
    });
    builder.addCase(getActivitiesChart.fulfilled, (state, action) => {
      state.loadingActivitiesChart = false;
      state.activitiesChart = action.payload.data;
    });
    builder.addCase(getActivitiesChart.rejected, (state, action) => {
      state.loadingActivitiesChart = false;
      state.error = action.payload.error;
    });
  },
});

export const { reset } = statsSlice.actions;
export default statsSlice.reducer;
