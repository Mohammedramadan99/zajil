import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="app">
      {/* <Navbar /> */}
      nav
      <Outlet />
      footer
      {/* <Footer /> */}
    </div>
  );
};
export default RootLayout;
