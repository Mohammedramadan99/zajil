import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home";
import DashboardHome from "./pages/dashboard/home/DashboardHome";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import PrivateRoutes from "./utils/PrivateRoutes";
import Login from "./components/Auth/Login/Login";

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
  return <RouterProvider router={router} />;
}

export default App;
