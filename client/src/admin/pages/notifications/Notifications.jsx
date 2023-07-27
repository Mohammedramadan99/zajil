import React from "react";
import { Box, Container, Grid, useTheme } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import Mobile from "../../components/Notifications/Mobile";

function Notifications() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
        paddingBlock: 2,
        // paddingInline: 2,
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Notifications"} subTitle={"Send Notifications"} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            one
          </Grid>
          <Grid item xs={6}>
            <Mobile/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Notifications;
