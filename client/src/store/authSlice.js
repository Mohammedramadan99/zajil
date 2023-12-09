import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const loggedIn = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = token?.split(".")[1];
    const payloadObj = JSON.parse(atob(payload));

    const exp = new Date(payloadObj.exp * 1000);
    const now = new Date();

    if (now.getTime() > exp.getTime()) {
      return null;
    } else {
      const { iat, exp, ...props } = payloadObj;
      const user = { ...props, token };

      return user;
    }
  } else {
    return null;
  }
};

export const registerAction = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
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

      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
// Login
export const loginAction = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
// Profile
export const profileAction = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { user } = auth;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData?.data?.message?.errors
            ? errorData.data.message.errors
            : errorData.data.message
        );
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue({
        message: "An unknown error occurred. Please try again later.",
      });
    }
  }
);
export const logoutAction = createAsyncThunk(
  "user/logout",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.log(error.message);
    }
  }
);

const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  user: loggedIn(),
  profile: null,
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
    updateBusinesses: (state,{payload}) => {
      state.profile.businesses.push(payload)
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
      state.user = null;
      state.message = "logged out";
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.user = null;
      state.message =
        action.payload || "An unknown error occurred. Please try again later.";
    });
    // Profile
    builder.addCase(profileAction.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(profileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.profile = action.payload;
    });
    builder.addCase(profileAction.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload?.errors;
      state.message =
        action.payload || "An unknown error occurred. Please try again later.";
    });
  },
});

export const { reset,updateBusinesses } = authSlice.actions;

export default authSlice.reducer;
