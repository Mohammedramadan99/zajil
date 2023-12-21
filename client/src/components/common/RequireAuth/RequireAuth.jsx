import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { profileAction } from "../../../store/authSlice";

const RequireAuth = ({ allowedRole }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(profileAction());
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return user?.roles ? (
    allowedRole.includes(user?.roles[0]) ? (
      <>
        <Outlet />
      </>
    ) : user ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <>
        <Navigate to="/" state={{ from: location }} replace />
      </>
    )
  ) : (
    <>
      <Navigate to="/" state={{ from: location }} replace />
    </>
  );
};

export default RequireAuth;
