import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowBack,
  ArrowUpward,
  StorefrontOutlined,
  PaymentOutlined,
} from "@mui/icons-material";
function CardStats() {
  const theme = useTheme();

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Box>
              <Typography
                variant="h6"
                // fontSize={16}
                color={theme.palette.primary[100]}>
                Users
              </Typography>
              <Typography
                variant="h2"
                // fontSize={32}
                fontWeight={600}
                sx={{ my: 1 }}
                color={theme.palette.primary[100]}>
                200
              </Typography>
              <Stack direction="row" gap={1}>
                <Typography variant="body2" color={theme.palette.grey[500]}>
                  last month
                </Typography>
                <Typography variant="body2" color={"greenyellow"}>
                  <ArrowUpward fontSize="12" /> +12%
                </Typography>
              </Stack>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              borderRadius={"50%"}
              p={1}
              sx={{ background: "#c1212130", borderRadius: 3 }}>
              <StorefrontOutlined />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardStats;
