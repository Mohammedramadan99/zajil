import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import LineChart from "../../Charts/LineChart/LineChart";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import BasicSelect from "../BasicSelect";

function CardsChart({ businessId, setBusinessId }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { businesses } = useSelector((state) => state.businesses);
  const { cardsCount, cardsChart, activitiesChart, activities } = useSelector(
    (state) => state.stats
  );
  const handleChange = (e) => {
    setBusinessId(e.target.value);
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
          Card Charts{" "}
        </Typography>
        <Box sx={{ width: "150px", m: 2 }}>
          <BasicSelect
            handleChange={handleChange}
            value={businessId}
            items={businesses}
          />
        </Box>
      </Stack>
      <Card >
        <CardContent sx={{ height: "580px" }}>
          <LineChart myData={cardsChart} />
        </CardContent>
      </Card>
    </>
  );
}

export default CardsChart;
