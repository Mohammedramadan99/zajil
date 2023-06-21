import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Card from "../../components/Cards/Card/Card";
import cardBg_1 from "../../../assets/images/card_bg_1.jpg";
import { Star } from "@mui/icons-material";
import Visa from "../../components/Cards/Card/Visa";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

function Cards() {
  const theme = useTheme();
  const navigate = useNavigate();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
        paddingBlock: 2,
        // paddingInline: 2,
      }}>
      <Container>
        <Grid container spacing={2}>
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
            <ButtonGroup
              sx={{ flexDirection: "column", gap: 1, width: "100%" }}>
              <Button variant="contained">template</Button>
              <Button onClick={() => navigate("/admin/cards/new")}>
                empty
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item lg={3}>
            <Card title="holidays" bg={cardBg_1} icon={<Star />} />
          </Grid>
          <Grid item lg={6}>
            <Visa />
          </Grid>
        </Grid>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Disagree
            </Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Cards;
