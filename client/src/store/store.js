import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import modeReducer from "./modeSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    mode: modeReducer,
  },
});
