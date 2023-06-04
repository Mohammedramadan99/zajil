import { useTheme } from "@emotion/react";
import { Box, Container, Grid } from "@mui/material";

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
        <Box>
          <form></form>
        </Box>
      </Container>
    </Box>
  );
}

export default CreateBusiness;
