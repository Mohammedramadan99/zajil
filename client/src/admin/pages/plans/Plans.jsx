import { Box, Container, useTheme } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import PlansItems from "../../components/Plans/PlansItems";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlans } from "../../../store/PlansSlice";
import { toast } from "react-toastify";
import { reset } from "../../../store/SubscriptionSlice";
function Plans() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { errorMessage } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(getPlans());
  }, []);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(reset());
    }
  }, [errorMessage]);

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Plans"} subTitle={"Our Plans"} />
        <PlansItems />
      </Container>
    </Box>
  );
}

export default Plans;
