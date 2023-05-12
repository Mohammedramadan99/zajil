import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import DashboardHome from "./admin/pages/home/Home";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./admin/components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ColorModeContext, useMode } from "./admin/theme";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const isAdmin = true;
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/admin",
    element: isAdmin ? (
      <DashboardLayout />
    ) : (
      <div>only admins can see this page</div>
    ),
    children: [
      {
        path: "/admin",
        element: <DashboardHome />,
      },
    ],
  },
]);

function App() {
  const { t, i18n } = useTranslation();
  const { light } = useSelector((state) => state.mode);
  const [theme, colorMode] = useMode();

  useEffect(() => {
    if (i18n.language.indexOf("ar") === 0) {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);
  return (
    <div className={`${light ? "parent-light-mode" : "parent-dark-mode"}`}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;
