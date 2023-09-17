import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import i18n from "./utils/i18n";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import store from "./store/store";
import "./index.scss";
import { Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Flip}
        />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
