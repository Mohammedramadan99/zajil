import { Outlet, Navigate, useNavigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const navigate = useNavigate();
  let auth = { token: false };
  return auth.token ? children : navigate("/");
};

export default PrivateRoutes;
