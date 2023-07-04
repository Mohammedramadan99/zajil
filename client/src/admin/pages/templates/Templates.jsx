import { useTheme } from "@emotion/react";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTemplates,
  createTemplate,
  reset,
} from "../../../store/TemplateSlice";

import BusinessesTabs from "../../components/Templates/Tabs";
import PageHeader from "../../components/PageHeader/PageHeader";
import ShowCard from "../../components/Cards/Card/ShowCard";
function Cards() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates, loading } = useSelector((state) => state.templates);
  const { businesses } = useSelector((state) => state.businesses);
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("450", "600"));

  useEffect(() => {
    businesses?.length > 0 && dispatch(getTemplates(businesses[0]?.id));
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
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Templates"} subTitle={"All Your Templates"} />
        {businesses?.length > 0 ? (
          <Grid container spacing={2}>
            {/* Tabs */}
            <Grid item xs={12}>
              <BusinessesTabs />
            </Grid>
            {/* Create Card */}
            <Grid
              item
              lg={3}
              md={4}
              sm={6}
              xs={12}
              mb={2}
              mt={2}
              sx={{
                ...(isSmallScreen && {
                  margin: "40px",
                }),
              }}>
              {/* Card */}
              <Box
                className="flex"
                sx={{
                  width: "100%",
                  minHeight: "550px",

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
            {templates && templates?.rows && templates?.rows?.length > 0 ? (
              templates?.rows?.map((template) => (
                <Grid
                  key={template?.id}
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  mb={2}
                  mt={2}
                  sx={{
                    ...(isSmallScreen && {
                      margin: "40px",
                    }),
                  }}>
                  <ShowCard
                    template={template || null}
                    title={template?.name}
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
                  this business Doesn't have templates yet
                </Typography>
              </>
            )}
            {loading && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
            {/* <Grid item lg={6}>
            <Visa />
          </Grid> */}
          </Grid>
        ) : (
          <Typography
            variant="h3"
            display={"flex"}
            flexDirection={"column"}
            justifyItems={"center"}
            alignItems={"center"}
            textTransform={"capitalize"}
            marginTop={30}>
            create a business to create a template
            <Button variant="contained" sx={{ display: "block", mt: 2 }}>
              <Link
                to="/admin/business/new"
                style={
                  {
                    // color: theme.palette.primary[500],
                  }
                }>
                create business
              </Link>
            </Button>
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Cards;
