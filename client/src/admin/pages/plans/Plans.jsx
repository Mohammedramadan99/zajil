import { Box, Container, useTheme } from "@mui/material";
import PageHeader from "../../components/PageHeader/PageHeader";
import PlansItems from "../../components/Plans/PlansItems";
import { useEffect } from "react";
import { useDispatch } from 'react-redux'
import { getPlans } from "../../../store/PlansSlice";

function Plans() {
  const theme = useTheme() 
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getPlans())
  }, [])
  
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container sx={{ pb: 20 }}>
        <PageHeader title={"Plans"} subTitle={"Our Plans"} />
        <PlansItems/>
      </Container>
    </Box>
  );
}

export default Plans;