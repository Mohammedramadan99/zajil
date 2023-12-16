import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { lazy, startTransition, Suspense, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./admin/components/Layout/Layout";
import RequireAuth from "./components/common/RequireAuth/RequireAuth";

const Home = lazy(() => import("./pages/Home/Home"));
const DashboardHome = lazy(() => import("./admin/pages/home/Home"));

const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Templates = lazy(() => import("./admin/pages/templates/Templates"));
const Location = lazy(() => import("./admin/pages/Location/Location"));
const CreateBusiness = lazy(() =>
  import("./admin/pages/CreateBusiness/CreateBusiness")
);
const CreateBranch = lazy(() =>
  import("./admin/pages/CreateBranch/CreateBranch")
);
const Business = lazy(() => import("./admin/pages/business/Business"));
const CreateTemplate = lazy(() =>
  import("./admin/pages/createTemplate/CreateTemplate")
);
const CardControl = lazy(() => import("./admin/pages/cardControl/CardControl"));
const CreateCard = lazy(() => import("./admin/pages/controlCard/CreateCard"));
const Cards = lazy(() => import("./admin/pages/cards/Cards"));
const CardDetails = lazy(() => import("./admin/pages/cardDetails/CardDetails"));
const Scan = lazy(() => import("./admin/pages/Scan/Scan"));
const Notifications = lazy(() =>
  import("./admin/pages/notifications/Notifications")
);
const Plans = lazy(() => import("./admin/pages/plans/Plans"));
const Tickets = lazy(() => import("./dashboard/pages/Tickets/Tickets"));
const Ticket = lazy(() => import("./dashboard/pages/Ticket/Ticket"));
const Event = lazy(() => import("./dashboard/pages/Event/Event"));

import AOS from "aos";
import "aos/dist/aos.css";
import { CircularProgress } from "@mui/material";
import Loading from "./components/common/Loading/Loading";

function App() {
  const { t, i18n } = useTranslation();
  const { mode } = useSelector((state) => state.mode);
  const { user } = useSelector((state) => state.auth);
  const { businesses } = useSelector((state) => state.businesses);
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
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          element: <RequireAuth allowedRole={["business_owner"]} />,
          children: [
            {
              path: "templates",
              element: (
                <Suspense fallback={<Loading />}>
                  <Templates />
                </Suspense>
              ),
            },
            {
              path: "tickets",
              element: (
                <Suspense fallback={<Loading />}>
                  <Tickets />
                </Suspense>
              ),
            },
            {
              path: "ticket",
              element: (
                <Suspense fallback={<Loading />}>
                  <Ticket />
                </Suspense>
              ),
            },
            {
              path: "event",
              element: (
                <Suspense fallback={<Loading />}>
                  <Event />
                </Suspense>
              ),
            },
            {
              path: "location",
              element: (
                <Suspense fallback={<Loading />}>
                  <Location />
                </Suspense>
              ),
            },
            {
              path: "plans",
              element: (
                <Suspense fallback={<Loading />}>
                  <Plans />
                </Suspense>
              ),
            },
            {
              path: "business",
              element: (
                <Suspense fallback={<Loading />}>
                  <Business />
                </Suspense>
              ),
            },
            {
              path: "business/new",
              element: (
                <Suspense fallback={<Loading />}>
                  <CreateBusiness />
                </Suspense>
              ),
            },
            {
              path: "branch/new",
              element: (
                <Suspense fallback={<Loading />}>
                  <CreateBranch />
                </Suspense>
              ),
            },
            {
              path: "templates/new",
              element: (
                <Suspense fallback={<Loading />}>
                  <CreateTemplate />
                </Suspense>
              ),
            },
            {
              path: "cards",
              element: (
                <Suspense fallback={<Loading />}>
                  <Cards />
                </Suspense>
              ),
            },
            {
              path: "cards/:businessId/:cardId",
              element: (
                <Suspense fallback={<Loading />}>
                  <CardDetails />
                </Suspense>
              ),
            },
            {
              path: "cards/control/:cardId",
              element: (
                <Suspense fallback={<Loading />}>
                  <CardControl />
                </Suspense>
              ),
            },
            {
              path: "scan",
              element: (
                <Suspense fallback={<Loading />}>
                  <Scan />
                </Suspense>
              ),
            },
            {
              path: "notifications",
              element: (
                <Suspense fallback={<Loading />}>
                  <Notifications />
                </Suspense>
              ),
            },
          ],
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
