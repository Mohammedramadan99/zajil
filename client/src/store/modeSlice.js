import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  light: true,
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    changeMode: (state, action) => {
      state.light = !state.light;
    },
  },
});

export const { changeMode } = modeSlice.actions;

export default modeSlice.reducer;
