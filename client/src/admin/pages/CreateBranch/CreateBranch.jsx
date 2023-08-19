import { useTheme } from "@emotion/react";
import { Box, Container, Grid } from "@mui/material";
import React, { memo, useEffect } from "react";
import CreateBranchForm from "../../components/CreateBusiness/CreateBranchForm";
import { useDispatch } from "react-redux";
import { getBusinesses } from "../../hooks/Businesses";

function CreateBranch() {
  const theme = useTheme();
  const dispatch = useDispatch()
  const { error, isLoading } = getBusinesses();
  
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <CreateBranchForm />
      </Container>
    </Box>
  );
}

export default memo(CreateBranch);
