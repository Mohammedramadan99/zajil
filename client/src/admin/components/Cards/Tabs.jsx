import { memo, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { getBusinesses } from "../../../store/businessSlice";
import { getTemplates } from "../../../store/TemplateSlice";
import { getCards } from "../../../store/cardSlice";

function BusinessesTabs() {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const { businesses } = useSelector((state) => state.businesses);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //   fetch Here according to the active tab
  const templatesHandler = (id) => {
    dispatch(getCards(id));
  };
  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480, lg: "100%" }, mt: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs">
        {businesses?.map((item) => (
          <Tab
            key={item.id}
            label={item.name}
            onClick={() => templatesHandler(item?.id)}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default memo(BusinessesTabs);
