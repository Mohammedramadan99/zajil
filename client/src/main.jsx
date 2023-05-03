import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import i18n from "./utils/i18n";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
