import { Outlet } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../store/modeSlice";
import Navbar from "./Navbar";
const RootLayout = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.mode);
  const changeModeHandler = () => {
    dispatch(setMode());
  };
  return <Outlet />;
};
export default RootLayout;
