import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function getCookie(cookieName) {
  const cookieValue = document.cookie.match(
    "(^|[^;]+)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? JSON.parse(cookieValue.pop()) : null;
}
export const createCard = createAsyncThunk(
  "cards/create",
  async (cardData, { rejectWithValue }) => {
    try {
      const user = getCookie("userInfo");
      console.log("action");
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

const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  card: {},
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const cardSlice = createSlice({
  name: "cards",
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCard.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createCard.fulfilled, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = null;
      state.card = action.payload;
    });
    builder.addCase(createCard.rejected, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = action.payload?.errors;
      state.card = null;
    });
  },
});

export const { reset } = cardSlice.actions;

export default cardSlice.reducer;
