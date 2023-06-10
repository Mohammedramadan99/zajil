import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessesTable from "./BusinessesTable";
function BusinessSide() {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h2">Businesses</Typography>
      <Button variant="outlined" sx={{ mt: 2 }}>
        create new business
      </Button>

      <Typography mt={2} display={"flex"}>
        <span
          style={{
            color: theme.palette.grey[500],
            display: "flex",
            alignItems: "center",
          }}>
          Businesses <ArrowForwardIcon className="" sx={{ mx: 1 }} />
        </span>{" "}
        22
      </Typography>
      <Box mt={2}>
        <BusinessesTable />
      </Box>
    </Box>
  );
}

export default BusinessSide;
