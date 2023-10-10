import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import templateReducer from "./TemplateSlice";
import modeReducer from "./modeSlice";
import businessesReducer from "./businessSlice";
import statsReducer from "./statsSlice";
import cardsReducer from "./CardSlice";
import plansReducer from "./PlansSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    mode: modeReducer,
    templates: templateReducer,
    businesses: businessesReducer,
    cards: cardsReducer,
    stats: statsReducer,
    plans: plansReducer,
  },
});
