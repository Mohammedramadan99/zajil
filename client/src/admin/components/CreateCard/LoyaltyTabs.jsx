import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack, TextField, useTheme } from "@mui/material";

function TabPanel(props) {
  const { children, value, onChange, formik, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs({ onChange, formik }) {
  console.log({ onChange, formik });
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: theme.palette.grey[900],
        display: "flex",
        height: 100,
      }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}>
        <Tab label="Gifts" {...a11yProps(0)} />
        <Tab label="Discound" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0} sx={{ width: "100%" }}>
        <Stack direction={"row"} spacing={2} width={"100%"}>
          <TextField
            name="gift"
            label="Gift"
            value={formik.values.gift}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.gift)}
            helperText={formik.errors.gift}
            sx={{
              width: "100%",
            }}
          />
          <TextField
            name="giftPoints"
            label="Points"
            value={formik.values.giftPoints}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.giftPoints)}
            helperText={formik.errors.giftPoints}
            sx={{
              width: "100%",
            }}
          />
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stack direction={"row"} spacing={2} width={"100%"}>
          <TextField
            name="discound"
            label="Discound"
            value={formik.values.discound}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.discound)}
            helperText={formik.errors.discound}
            sx={{
              width: "100%",
            }}
          />
          <TextField
            name="discoundPoints"
            label="Points"
            value={formik.values.discoundPoints}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.discoundPoints)}
            helperText={formik.errors.discoundPoints}
            sx={{
              width: "100%",
            }}
          />
        </Stack>
      </TabPanel>
    </Box>
  );
}
