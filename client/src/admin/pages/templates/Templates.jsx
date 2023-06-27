import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Card from "../../components/Cards/Card/Card";
import cardBg_1 from "../../../assets/images/card_bg_1.jpg";
import { Star } from "@mui/icons-material";
import Visa from "../../components/Cards/Card/Visa";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTemplates,
  createTemplate,
  reset,
} from "../../../store/TemplateSlice";

import BusinessesTabs from "../../components/Templates/Tabs";
function Cards() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates } = useSelector((state) => state.templates);
  const { businesses } = useSelector((state) => state.businesses);

  useEffect(() => {
    dispatch(getTemplates(businesses[0]?.id));
    dispatch(reset());
  }, [businesses]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
        paddingBlock: 2,

        // paddingInline: 2,
      }}>
      <Container>
        <Grid container spacing={2}>
          {/* Tabs */}
          <Grid xs={12}>
            <BusinessesTabs />
          </Grid>
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
              create a new template
            </Typography>
            <ButtonGroup
              sx={{ flexDirection: "column", gap: 1, width: "100%" }}>
              <Button variant="contained">template</Button>
              <Button onClick={() => navigate("/admin/templates/new")}>
                empty
              </Button>
            </ButtonGroup>
          </Grid>
          {templates?.rows?.length > 0 ? (
            templates?.rows?.map((template) => (
              <Grid key={template?.id} item lg={3}>
                <Card
                  template={template}
                  title="holidays"
                  bg={cardBg_1}
                  icon={<Star />}
                />
              </Grid>
            ))
          ) : (
            <>
              <Typography
                variant="body1"
                textTransform={"capitalize"}
                textAlign={"center"}
                pl={5}
                pt={2}>
                this business don't have templates yet
              </Typography>
            </>
          )}
          {/* <Grid item lg={6}>
            <Visa />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}

export default Cards;
