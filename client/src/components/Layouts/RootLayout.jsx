import { Outlet } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../store/modeSlice";
import Navbar from "./Navbar";
const RootLayout = () => {
  const dispatch = useDispatch();
  const { light } = useSelector((state) => state.mode);
  const changeModeHandler = () => {
    dispatch(changeMode());
  };
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      footer
      {/* <Footer /> */}
    </div>
  );
};
export default RootLayout;
