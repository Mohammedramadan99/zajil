import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";

function PlansItems() {
  const theme = useTheme();
  const plans = [
    {
      id: "1",
      name: "Basic",
      description: "Basic Plan with some features",
      price: 90,
      active: false,
      maxBranches: 1,
      maxCouponTemplates: 0,
      maxCouponCards: 0,
      maxLoyaltyTemplates: 1,
      maxLoyaltyCards: 100,
      maxEventsTemplates: 0,
      maxEventsCards: 0,
      maxItemSubscriptionTemplates: 1,
      maxItemSubscriptionCards: 100,
      charts: {},
    },
    {
      id: "2",
      name: "Gold",
      description: "Gold Plan with more features",
      price: 90,
      active: false,
      maxBranches: 1,
      maxCouponTemplates: 0,
      maxCouponCards: 0,
      maxLoyaltyTemplates: 1,
      maxLoyaltyCards: 100,
      maxEventsTemplates: 0,
      maxEventsCards: 0,
      maxItemSubscriptionTemplates: 1,
      maxItemSubscriptionCards: 100,
      charts: {},
    },
    {
      id: "3",
      name: "Platinum",
      description: "Basic Plan with a lot of features",
      price: 90,
      active: false,
      maxBranches: 1,
      maxCouponTemplates: 0,
      maxCouponCards: 0,
      maxLoyaltyTemplates: 1,
      maxLoyaltyCards: 100,
      maxEventsTemplates: 0,
      maxEventsCards: 0,
      maxItemSubscriptionTemplates: 1,
      maxItemSubscriptionCards: 100,
      charts: {},
    },
  ];
  return (
    <Grid container spacing={2}>
      {plans.map((item) => {
        const { id, name, description, price, active, charts, ...rest } = item;
        const features = [
          { label: "Max Branches", value: rest.maxBranches },
          { label: "Max Loyalty Templates", value: rest.maxLoyaltyTemplates },
          { label: "Max Loyalty Cards", value: rest.maxLoyaltyCards },
        ];
        return (
          <Grid key={item.id} item xs={12} md={4}>
            <Card>
              <CardActionArea>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}>
                  <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={2}>
                    <AcUnitIcon
                      sx={{ fontSize: 40, color: theme.palette.primary[500] }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        textAlign: "center",
                        fontWeight: "600",
                      }}>
                      {item.name} Plan
                    </Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={1}>
                    <span>$</span>
                    <Typography fontSize={70} fontWeight={600}>
                      {" "}
                      {item.price}{" "}
                    </Typography>
                    <span>/mo</span>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default PlansItems;
