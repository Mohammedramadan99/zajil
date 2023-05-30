import { useTheme } from "@emotion/react";
import { Box, Button, ButtonGroup, Grid, Typography } from "@mui/material";
import React from "react";
import Card from "../../components/Cards/Card/Card";
import cardBg_1 from "../../../assets/images/card_bg_1.jpg";
import { Star } from "@mui/icons-material";
function Cards() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
      }}>
      <Grid container spacing={2} p={2}>
        {/* Create Card */}
        <Grid item lg={3}>
          {/* Card */}
          <Box
            className="flex"
            sx={{
              width: "100%",
              height: "500px",
              background: theme.palette.grey[800],
              color: theme.palette.grey[700],
              textTransform: "uppercase",
              fontSize: "60px",
              fontWeight: 900,
              borderRadius: "20px",
            }}>
            add
          </Box>
          <Typography
            variant="h4"
            my={2}
            textTransform={"capitalize"}
            textAlign={"center"}
            fontWeight={600}>
            create a new card
          </Typography>
          <ButtonGroup sx={{ flexDirection: "column", gap: 1, width: "100%" }}>
            <Button variant="contained">template</Button>
            <Button>empty</Button>
          </ButtonGroup>
        </Grid>
        <Card title="holidays" bg={cardBg_1} icon={<Star />} />
      </Grid>
    </Box>
  );
}

export default Cards;
