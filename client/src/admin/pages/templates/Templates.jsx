import { useTheme } from "@emotion/react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BusinessesTabs from "../../components/Templates/Tabs";
import PageHeader from "../../components/PageHeader/PageHeader";
import TemplatesList from "../../components/Templates/TemplatesList";
import { getTemplates } from "../../../store/TemplateSlice";
import NoDataMsg from "../../../components/common/NoDataMsg/NoDataMsg";

function Templates() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  const [subscription, setSubscription] = useState(
    profile?.businesses[0]?.subscription ? true : false
  );
  const { businesses } = useSelector((state) => state.businesses);
  const { templates, loading } = useSelector((state) => state.templates);
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("450", "600"));

  // const { error: templetesError, isLoading: templetesLoading } =
  //   useGetTemplates(businesses && businesses[0]?.id);
  useEffect(() => {
    if (profile?.businesses[0]?.id) {
      dispatch(getTemplates(profile?.businesses[0]?.id));
      setSubscription(profile?.businesses[0]?.subscription ? true : false);
    }
  }, [profile?.businesses]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
        paddingBlock: 2,
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Templates"} subTitle={"All Your Templates"} />
        <Grid container spacing={2}>
          {/* Tabs */}
          <Grid item xs={12}>
            <BusinessesTabs
              subscription={subscription}
              setSubscription={setSubscription}
            />
          </Grid>

          {/* Create Card */}
          {loading ? (
            <Box sx={{ height: "70vh", width: "100%" }} className="flex">
              <CircularProgress />
            </Box>
          ) : profile?.businesses?.length < 1 ? (
            <Grid xs={12}>
              <Typography
                variant="h3"
                display={"flex"}
                flexDirection={"column"}
                justifyItems={"center"}
                alignItems={"center"}
                textTransform={"capitalize"}
                marginTop={30}>
                <NoDataMsg msg="Please create at lease one business" />
                <Button variant="contained" sx={{ display: "block", mt: 2 }}>
                  <Link
                    to="/dashboard/business/new"
                    style={
                      {
                        // color: theme.palette.primary[500],
                      }
                    }>
                    create business
                  </Link>
                </Button>
              </Typography>
            </Grid>
          ) : subscription ? (
            <>
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
                  <Button onClick={() => navigate("/dashboard/templates/new")}>
                    empty
                  </Button>
                </ButtonGroup>
              </Grid>
              <TemplatesList />
            </>
          ) : (
            // if no subscription for the selected business
            <Grid xs={12} mt={3}>
              <Alert variant="outlined" severity="error">
                This business doesn't have a subscription. let's discover
                <Link to="/dashboard/plans">
                  <strong> Our Plans</strong>
                </Link>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default memo(Templates);
