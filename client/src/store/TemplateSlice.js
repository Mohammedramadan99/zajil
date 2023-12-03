import { useTheme } from "@mui/material";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createTemplate = createAsyncThunk(
  "templates/create",
  async (cardData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/businesses/${
          cardData.params.businessId
        }/card-templates`,
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
export const getTemplates = createAsyncThunk(
  "templates/all",
  async (businessId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const { user } = auth;

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/businesses/${businessId}/card-templates`,
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
const initialState = {
  // user: JSON.parse(localStorage.getItem("userInfo")),
  templates: null,
  template: null,
  cardType: "LOYALTY",
  sharedProps: {
    textLogo: "",
    // tempPhoto: "",
    logoImg: null,
    labelColor: "rgb(0,0,0)",
    textColor: "rgb()",
    backgroundColor: "#ffffff",
    headerFieldValue: "",
    headerFieldLabel: "",
    activeImg: "",
    imgColor: "",
    logoUrl: "",
    iconUrl: "",
    stripUrl: {},
    barcode: "",
    activeScanType: {
      icon: "/src/assets/images/stickers/qrCode_icon-1.png",
      type: "PKBarcodeFormatQR",
      url: "/src/assets/images/qrcode.png",
    },
  },
  normalCardsTemplate: {
    stickersNumber: null,
    activeIcon: "",
    activeScanType: "",
    name: "",
    // Shared
    tempPhoto: "",
    logoImg: null,
    textLogo: null,
    imgColor: "",
    activeImg: "",
    labelColor: "",
    textColor: "",
    backgroundColor: "#ffffff",
    headerFieldValue: "",
    headerFieldLabel: "",
    barcode: "",
  },
  couponCardsTemplate: {
    name: "",
    startDate: "",
    endDate: "",
    occasionName: "",
    logoUrl: "",
    iconUrl: "",
    stripUrl: "",
    logoText: "",
    designType: "",
    backgroundColor: "",
    foregroundColor: "",
    labelColor: "",
    headerFields: {
      label: "",
      value: "",
    },
    secondaryFields: {
      label: "",
      value: "",
    },
  },
  loading: false,
  errors: null,
  errorMessage: null,
  successMessage: null,
};
const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    reset: (state) => {
      state.template = null;
      state.templates = null;
      state.errors = null;
      state.errorMessage = null;
      state.successMessage = null;
      state.errors = null;
    },
    setTempletes: (state, { payload }) => {
      state.templates = payload;
    },
    setCardType: (state, { payload }) => {
      state.cardType = payload;
    },
    setSharedProps: (state, action) => {
      const { propName, propValue } = action.payload;
      state.sharedProps[propName] = propValue;
    },
    setNormalCardsTemplate: (state, action) => {
      const { propName, propValue } = action.payload;
      state.normalCardsTemplate[propName] = propValue;
    },
    setCouponCardsTemplate: (state, action) => {
      const { propName, propValue } = action.payload;
      state.couponCardsTemplate[propName] = propValue;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTemplate.pending, (state, action) => {
      state.loading = true;
      state.errors = null;
    });
    builder.addCase(createTemplate.fulfilled, (state, action) => {
      state.loading = false;
      state.errors = null;
      state.template = action.payload.data;
    });
    builder.addCase(createTemplate.rejected, (state, action) => {
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

export const {
  reset,
  setTempletes,
  setCardType,
  setNormalCardsTemplate,
  setCouponCardsTemplate,
  setSharedProps,
} = templateSlice.actions;

export default templateSlice.reducer;
