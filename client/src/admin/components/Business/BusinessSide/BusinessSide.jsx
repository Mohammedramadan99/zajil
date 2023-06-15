import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessesTable from "./BusinessesTable";
import useBusiness from "../../../../hooks/useBusiness";
import { businesses } from "../../../../utils/mockup/data";
import { useNavigate } from "react-router-dom";
function BusinessSide() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getBusinesses, data, pending, error } = useBusiness();
  useEffect(() => {
    // getBusinesses();
  }, []);

  return (
    <Box>
      <Typography variant="h2">Businesses</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("new")}>
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
        <BusinessesTable data={businesses} />
      </Box>
    </Box>
  );
}

export default BusinessSide;
