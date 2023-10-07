import { Box, Container, useTheme } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";

function Plans() {
    const theme = useTheme()
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Plans"} subTitle={"Our Plans"} />
      </Container>
    </Box>
  );
}

export default Plans;
