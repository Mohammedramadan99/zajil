import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CreateBusinessForm from "../../../admin/components/CreateBusiness/CreateBusinessForm";
// import CreateBusinessForm from "../../../components/Dashboard/CreateBusiness/CreateBusinessForm";

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
        <CreateBusinessForm />

        {/* <Grid xs={6} item data-aos="fade-left">
            <CreateBranchForm />
          </Grid> */}
      </Container>
    </Box>
  );
}

export default CreateBusiness;
