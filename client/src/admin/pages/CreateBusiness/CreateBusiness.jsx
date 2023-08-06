import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CreateBusinessForm from "../../../admin/components/CreateBusiness/CreateBusinessForm";
import useBusiness from "../../../hooks/useBusiness";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import { resetBusiness } from "../../../store/businessSlice";
function CreateBusiness() {
  const theme = useTheme();

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <CreateBusinessForm />
        {/* <Grid xs={6} item data-aos="fade-left">
            <CreateBranchForm />
          </Grid> */}
      </Container>
    </Box>
  );
}

export default memo(CreateBusiness);
