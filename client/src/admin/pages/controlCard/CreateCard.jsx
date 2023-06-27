import { useTheme } from "@emotion/react";
import { Box, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";
import CreateCardForm from "../../components/CreateCard/CreateCardForm/CreateCardForm";

function CreateCard() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Container>
        <CreateCardForm />
      </Container>
    </Box>
  );
}

export default CreateCard;
