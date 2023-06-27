import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import templateReducer from "./TemplateSlice";
import modeReducer from "./modeSlice";
import businessesReducer from "./businessSlice";
import cardsReducer from "./CardSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    mode: modeReducer,
    templates: templateReducer,
    businesses: businessesReducer,
    cards: cardsReducer,
  },
});
