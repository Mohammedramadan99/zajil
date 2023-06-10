import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* <Navbar /> */}
      dashboard nav
      <Outlet />
      dashboard footer
      {/* <Footer /> */}
    </div>
  );
};
export default DashboardLayout;
