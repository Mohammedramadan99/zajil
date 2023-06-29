import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

function PageHeader({ title, subTitle }) {
  const theme = useTheme();
  return (
    <Box mb={4}>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body2" my={"2px"} color={theme.palette.grey[500]}>
        {subTitle}
      </Typography>
    </Box>
  );
}

export default PageHeader;
