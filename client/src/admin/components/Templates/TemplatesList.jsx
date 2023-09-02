import React, { useEffect } from "react";
import { getTemplates, reset } from "../../../store/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import cardBg_1 from "../../../assets/images/card_bg_1.jpg";
import Card from "../../components/Cards/Card/Card";
import { Star } from "@mui/icons-material";

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
  useMediaQuery,
} from "@mui/material";
import ShowCard from "../../components/Cards/Card/ShowCard";

function TemplatesList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.templates);
  const { businesses } = useSelector((state) => state.businesses);
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("450", "600"));

  // useEffect(() => {
  //   businesses.length > 0 && dispatch(getTemplates(businesses[0].id));
  //   dispatch(reset());
  // }, []);
  return (
    <>
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
              template={template || {}}
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
    </>
  );
}

export default TemplatesList;
