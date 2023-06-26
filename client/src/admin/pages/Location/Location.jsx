import { useTheme } from "@emotion/react";
import { Box, Container, Grid, Stack } from "@mui/material";
import LocationForm from "../../../admin/components/Location/LocationForm";
import Card from "../../../admin/components/Cards/Card/Card";
import QrcodeScanner from "../../components/QrcodeScanner/QrcodeScanner";

function Location() {
  const theme = useTheme();

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Box width={"400px"}></Box>

      <Container>
        <Grid container spacing={2}>
          <Grid lg={6} item xs={12}>
            <LocationForm />
          </Grid>
          <Grid lg={6} item xs={12}>
            <Stack
              sx={{
                backgroundColor: theme.palette.grey[900],
                height: "100%",
                padding: 2,
              }}>
              <Box width={"50%"} m={"auto"}>
                <Card title="holidays" withControl={false} />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Location;
