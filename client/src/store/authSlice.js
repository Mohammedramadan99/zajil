import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function getCookie(cookieName) {
  const cookieValue = document.cookie.match(
    "(^|[^;]+)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? JSON.parse(cookieValue.pop()) : null;
}
export const registerAction = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
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
// Login
export const loginAction = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return rejectWithValue(
          errorData?.data?.message?.errors
            ? errorData.data.message.errors
            : errorData.data.message
        );
      }
      const { data } = await response.json();

      document.cookie =
        "cookieName=cookieValue; expires=expirationDate; path=pathValue";
      const expirationDate = new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toUTCString();
      document.cookie =
        "userInfo=" +
        JSON.stringify(data) +
        "; expires=" +
        expirationDate +
        "; path=/";
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again laterrr.",
      });
    }
  }
);
export const logoutAction = createAsyncThunk(
  "user/logout",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      document.cookie =
        "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.log(error.message);
    }
  }
);

const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  user: getCookie("userInfo") || null,
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const authSlice = createSlice({
  name: "user",
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
    builder.addCase(registerAction.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = null;
      state.user = null;
      state.successMessage = "user registered";
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      console.log({ action });
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage = action.payload.errors
        ? null
        : action.payload ||
          "An unknown error occurred. Please try again later.";
    });
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.successMessage = null;
      state.user = action.payload;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.errorMessage =
        action.payload || "An unknown error occurred. Please try again later.";
    });
    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.user = {};
      state.message = "logged out";
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.message =
        action.payload || "An unknown error occurred. Please try again later.";
    });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
