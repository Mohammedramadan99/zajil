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
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import RemoveIcon from "@mui/icons-material/Remove";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription, reset } from "../../../store/SubscriptionSlice";
import { useEffect, useState } from "react";
import BusinessesDialog from "../common/BusinessesDialog";
import { toast } from "react-toastify";

function EventsPlans() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedPlan, setSelectedPlan] = useState();
  const { eventsPlans } = useSelector((state) => state.plans);
  const { success } = useSelector((state) => state.subscriptions);
  const handleClickListItem = (planId) => {
    setOpen(true);
    setSelectedPlan(planId);
  };
  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      const actionData = {
        params: { businessId: newValue },
        data: { planId: selectedPlan, numberOfMonths: 2 },
      };
      dispatch(createSubscription(actionData));
    }
  };
  useEffect(() => {
    if (success) {
      toast.success("Subscribed Successfully");
      dispatch(reset());
    }
  }, [success]);

  return (
    <>
      <Typography
        sx={{
          mt: 4,
          mb: 2,
          fontSize: 60,
          fontWeight: 200,
          textAlign: "center",
        }}>
        <Typography
          sx={{
            mb: 2,
            fontSize: 60,
            fontWeight: 500,
            color: theme.palette.primary.light,
            mr: 1,
          }}
          component={"span"}>
          Event-Based
        </Typography>
        Subscription Plans
      </Typography>
      <Grid container spacing={2}>
        {eventsPlans?.map((item) => {
          const {
            id,
            name,
            description,
            price,
            active,
            allActivetie,
            charts,
            ...rest
          } = item;
          const feats = [
            { label: "min Cards", value: item.minCards, type: "count" },
            { label: "max Cards", value: item.maxCards, type: "count" },
            {
              label: "basic Presintage",
              value: item.basicPresintage,
              type: "%",
            },
            { label: "vip Presintage", value: item.vipPresintage, type: "%" },
            { label: "vvip Presintage", value: item.vvipPresintage, type: "%" },
          ];
          console.log({ item });
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
                          textTransform: "capitalize",
                          pb:2
                        }}>
                        {item.name} Plan
                      </Typography>
                    </Stack>
                    {/* <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={1}>
                      <span style={{ color: theme.palette.primary[400] }}>
                        $
                      </span>
                      <Typography fontSize={70} fontWeight={600}>
                        {item.price}
                      </Typography>
                      <span>/mo</span>
                    </Stack> */}
                    <Stack spacing={4}>
                      {feats?.map((feat, i) => {
                        return (
                          <div key={i}>
                            <Grid container>
                              {/* <Grid item xs={2} sx={{ textAlign: "center" }}>
                                  {feat.value.cards > 0 ||
                                  feat.value.templates > 0 ? (
                                    <DoneAllIcon />
                                  ) : (
                                    <HistoryToggleOffIcon />
                                  )}
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "center" }}>
                                  {feat.value.templates && (
                                    <strong>
                                      {feat.value.templates > 0
                                        ? feat.value.templates
                                        : 0}
                                    </strong>
                                  )}
                                  {feat.value.cards && (
                                    <strong>
                                      {feat.value.cards !== -1 ? (
                                        <AllInclusiveIcon />
                                      ) : (
                                        0
                                      )}
                                    </strong>
                                  )}
                                </Grid> */}
                              <Grid item xs={2} sx={{ textAlign: "center" }}>
                                <DoneAllIcon />
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: "center" }}>
                                {feat.type === "%" && "%"}
                                {feat.value}
                              </Grid>
                              <Grid
                                item
                                xs={8}
                                sx={{ pl: 2, textTransform: "capitalize" }}>
                                {feat.label}
                              </Grid>
                            </Grid>
                          </div>
                        );
                      })}
                    </Stack>
                  </CardContent>
                </CardActionArea>
                <Button
                  variant="outlined"
                  sx={{ marginBlock: 2 }}
                  // onClick={() => subscribeHandler(item.id)}
                  onClick={() => handleClickListItem(id)}>
                  Purchase Plan
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <BusinessesDialog
        id="ringtone-menu"
        keepMounted
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        value={value}
      />
    </>
  );
}

export default EventsPlans;
