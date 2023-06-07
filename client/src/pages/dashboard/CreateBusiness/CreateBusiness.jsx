import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CreateBusinessForm from "../../../components/Dashboard/CreateBusiness/CreateBusinessForm";
import CreateBranchForm from "../../../components/Dashboard/CreateBusiness/CreateBranchForm";

function CreateBusiness() {
  const theme = useTheme();
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Container>
        <Grid container spacing={2}>
          <Grid xs={6} item>
            <CreateBusinessForm />
          </Grid>
          <Grid xs={6} item>
            <CreateBranchForm />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateBusiness;
