import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./pages/Home/Home";
import DashboardHome from "./admin/pages/home/Home";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./admin/components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Cards from "./admin/pages/cards/Cards";
import Location from "./admin/pages/Location/Location";
import CreateBusiness from "./admin/pages/CreateBusiness/CreateBusiness";
import CreateBranch from "./admin/pages/CreateBranch/CreateBranch";
import AOS from "aos";
import "aos/dist/aos.css";
import Business from "./admin/pages/business/Business";
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
      {
        path: "cards",
        element: <Cards />,
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
    ],
  },
]);

function App() {
  const { t, i18n } = useTranslation();
  const { mode } = useSelector((state) => state.mode);

  useEffect(() => {
    if (i18n.language.indexOf("ar") === 0) {
      document.body.dir = "rtl";
    } else {
      document.body.dir = "ltr";
    }
  }, [i18n.language]);
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: false, // animation only once
      easing: "ease-in-out", // animation easing function
      offset: 50, // animation start offset
    });
  }, []);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
