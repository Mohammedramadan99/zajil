import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { getTemplates } from "./../../../store/TemplateSlice";
import BackdropSpinner from "./../../../components/Loading/BackdropSpinner";
import { useTheme } from "@mui/material";
export default function BusinessesTabs({ subscription, setSubscription }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const { profile } = useSelector((state) => state.auth);
  const { businesses, loading } = useSelector((state) => state.businesses);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //   fetch Here according to the active tab
  const templatesHandler = (id) => {
    dispatch(getTemplates(id));
    const isSubscribed = profile?.businesses
      ?.filter((item) => item.subscription)
      .find((item) => item.id === id);
    if (isSubscribed) {
      setSubscription(true);
    } else {
      setSubscription(false);
    }
  };
  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480, lg: "100%" }, mt: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable auto tabs example">
        {businesses &&
          businesses?.map((item, i) => (
            <Tab
              key={i}
              label={item.name}
              onClick={() => templatesHandler(item?.id)}
            />
          ))}
      </Tabs>
      {loading && <BackdropSpinner />}
    </Box>
  );
}
