import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useBranch from "../../../../hooks/useBranch";
import BusinessesTable from "../BusinessSide/BusinessesTable";
import { branches } from "../../../../utils/mockup/data";
import { useNavigate } from "react-router-dom";

function BranchSide() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data, pending, error } = useBranch();
  useEffect(() => {
    // getBusinesses();
  }, []);

  return (
    <Box>
      <Typography variant="h2">Branches</Typography>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => navigate("/admin/branch/new")}>
        create new Branch
      </Button>

      <Typography mt={2} display={"flex"}>
        <span
          style={{
            color: theme.palette.grey[500],
            display: "flex",
            alignItems: "center",
          }}>
          Branches <ArrowForwardIcon className="" sx={{ mx: 1 }} />
        </span>{" "}
        36
      </Typography>
      <Box mt={2}>
        <BusinessesTable data={branches} />
      </Box>
    </Box>
  );
}

export default BranchSide;
