import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import DashboardHome from "./pages/dashboard/home/DashboardHome";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import PrivateRoutes from "./utils/PrivateRoutes";
import Login from "./components/Auth/Login/Login";
import i18n from "./utils/i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const isAdmin = false;
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
    children: [],
  },
]);

function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language.indexOf("ar") === 0) {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);
  return <RouterProvider router={router} />;
}

export default App;
