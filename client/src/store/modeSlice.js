import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
};

const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = modeSlice.actions;

export default modeSlice.reducer;
