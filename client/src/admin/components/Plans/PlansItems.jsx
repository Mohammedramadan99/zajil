import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveIcon from "@mui/icons-material/Remove";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';

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
          {
            label: "Max Branches",
            value: rest.maxBranches,
            withPlan: { basic: true, gold: true, platinum: true },
          },
          {
            label: "Max Loyalty Templates",
            value: rest.maxLoyaltyTemplates,
            withPlan: { basic: true, gold: true, platinum: true },
          },
          {
            label: "Max Loyalty Cards",
            value: rest.maxLoyaltyCards,
            withPlan: { basic: true, gold: true, platinum: true },
          },
          {
            label: "Max Subscription Templates",
            value: rest.maxItemSubscriptionTemplates,
            withPlan: { basic: true, gold: true, platinum: true },
          },
          {
            label: "Max Subscription Cards",
            value: rest.maxItemSubscriptionCards,
            withPlan: { basic: true, gold: true, platinum: true },
          },
          {
            label: "Max Coupon Templates",
            value: rest.maxCouponTemplates,
            withPlan: { basic: false, gold: true, platinum: true },
          },
          {
            label: "Max Coupon Cards",
            value: rest.maxCouponCards,
            withPlan: { basic: false, gold: true, platinum: true },
          },
          {
            label: "Max Events Templates",
            value: rest.maxEventsTemplates,
            withPlan: { basic: false, gold: false, platinum: false },
          },
          {
            label: "Max Events Cards",
            value: rest.maxEventsCards,
            withPlan: { basic: false, gold: false, platinum: false },
          },
        ];
        return (
          <Grid key={item.id} item xs={12} md={4}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}>
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
                    <span style={{ color: theme.palette.primary[400] }}>$</span>
                    <Typography fontSize={70} fontWeight={600}>
                      {" "}
                      {item.price}{" "}
                    </Typography>
                    <span>/mo</span>
                  </Stack>
                  <Stack spacing={4}>
                    {features.map((feat, i) => (
                      <div key={i}>
                        <Grid
                          container
                          sx={{
                            opacity: feat.withPlan[item.name.toLowerCase()]
                              ? 1
                              : 0.2,
                          }}>
                          <Grid item xs={2} sx={{ textAlign: "center" }}>
                            {feat.withPlan[item.name.toLowerCase()] ? (
                              <DoneAllIcon />
                            ) : (
                                <HistoryToggleOffIcon/>
                            )}
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: "center" }}>
                            <strong>{feat.value}</strong>
                          </Grid>
                          <Grid item xs={8}>
                            {feat.label}
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                  </Stack>
                </CardContent>
              </CardActionArea>
              <Button variant="outlined" sx={{ marginBlock: 2 }}>
                {" "}
                Purchase Plan{" "}
              </Button>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default PlansItems;
