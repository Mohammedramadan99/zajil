import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function getCookie(cookieName) {
  const cookieValue = document.cookie.match(
    "(^|[^;]+)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? JSON.parse(cookieValue.pop()) : null;
}
// Register
export const registerAction = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
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
      const data = await response.json();

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
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
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
  error: null,
  message: "",
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
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = null;
      state.message = "user registered";
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error;
      state.user = null;
    });
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.data;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error;
      state.user = null;
    });
    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = {};
      state.message = "logged out";
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.loading = false;
      // state.error = action.error;
      state.user = {};
    });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
