import { useTheme } from "@emotion/react";
import { Box, Container, Grid } from "@mui/material";
import React from "react";
import CreateBranchForm from "../../components/CreateBusiness/CreateBranchForm";

function CreateBranch() {
  const theme = useTheme();
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

export default CreateBranch;
