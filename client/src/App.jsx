import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import DashboardHome from "./admin/pages/home/Home";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./admin/components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Templates from "./admin/pages/templates/Templates";
import Location from "./admin/pages/Location/Location";
import CreateBusiness from "./admin/pages/CreateBusiness/CreateBusiness";
import CreateBranch from "./admin/pages/CreateBranch/CreateBranch";
import Business from "./admin/pages/business/Business";
import CreateTemplate from "./admin/pages/createTemplate/CreateTemplate";
import CardControl from "./admin/pages/cardControl/CardControl";
import CreateCard from "./admin/pages/controlCard/CreateCard";
import Cards from "./admin/pages/cards/Cards";
import CardDetails from "./admin/pages/cardDetails/CardDetails";
import Scan from "./admin/pages/Scan/Scan";
import AOS from "aos";
import "aos/dist/aos.css";
import Notifications from "./admin/pages/notifications/Notifications";

function App() {
  const { t, i18n } = useTranslation();
  const { mode } = useSelector((state) => state.mode);
  const { user } = useSelector((state) => state.auth);
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
      path: "/register",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <RootLayout />,
      children: [
        {
          path: "/auth/login",
          element: <Login />,
        },
        {
          path: "/auth/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/Card",
      element: <DashboardLayout />,
      children: [
        {
          path: "create/:templateId/:businessId",
          element: <CreateCard />,
        },
      ],
    },
    {
      path: "/admin",
      element: user ? <DashboardLayout /> : <Navigate to={"/auth/login"} />,
      children: [
        {
          path: "/admin",
          element: <DashboardHome />,
        },
        {
          path: "templates",
          element: <Templates />,
        },
        {
          path: "location",
          element: <Location />,
        },
        {
          path: "business",
          element: <Business />,
        },
        {
          path: "business/new",
          element: <CreateBusiness />,
        },
        {
          path: "branch/new",
          element: <CreateBranch />,
        },
        {
          path: "templates/new",
          element: <CreateTemplate />,
        },
        {
          path: "cards",
          element: <Cards />,
        },
        {
          path: "cards/:businessId/:cardId",
          element: <CardDetails />,
        },
        {
          path: "cards/control/:cardId",
          element: <CardControl />,
        },
        {
          path: "scan",
          element: <Scan />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (i18n.language.indexOf("ar") === 0) {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-out",
      offset: 50,
    });
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
