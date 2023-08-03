import { useTheme } from "@emotion/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivitiesChartPoints from "../../Charts/ActivitiesChart/ActivitiesChartPoints";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import BasicSelect from "../BasicSelect";

function ActivitiesChart({ activitiesChartSelect, setActivitiesChartSelect }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { businesses } = useSelector((state) => state.businesses);
  const { cardsCount, cardsChart, activitiesChart, activities } = useSelector(
    (state) => state.stats
  );
  const handleChange = (e) => {
    setActivitiesChartSelect(e.target.value);
  };
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        <Typography
          variant="body1"
          sx={{ p: 2, color: theme.palette.primary[300] }}>
          {" "}
          Activities Charts{" "}
        </Typography>
        <Box sx={{ width: "150px", m: 2 }}>
          <BasicSelect
            handleChange={handleChange}
            value={activitiesChartSelect}
            items={businesses}
          />
        </Box>
      </Stack>
      <Card>
        <CardContent sx={{ height: 500 }}>
          <ActivitiesChartPoints myData={activitiesChart} />
        </CardContent>
      </Card>
    </>
  );
}

export default ActivitiesChart;
