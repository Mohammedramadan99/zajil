import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import DashboardHome from "./pages/Dashboard/Home/DashboardHome";
import RootLayout from "./components/Layouts/RootLayout";
import DashboardLayout from "./components/Layouts/DashboardLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
