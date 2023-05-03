import { Outlet } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../../store/modeSlice";
const RootLayout = () => {
  const dispatch = useDispatch();
  const { light } = useSelector((state) => state.mode);
  const changeModeHandler = () => {
    dispatch(changeMode());
  };
  return (
    <div className="app">
      {/* <Navbar /> */}
      nav
      <LanguageSelector />
      <button onClick={changeModeHandler}>
        {light ? "dark mode" : "light mode"}
      </button>
      <Outlet />
      footer
      {/* <Footer /> */}
    </div>
  );
};
export default RootLayout;
