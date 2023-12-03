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

function PlansItems() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [selectedPlan, setSelectedPlan] = useState();
  const { allPlans } = useSelector((state) => state.plans);
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
      <Grid container spacing={2}>
        {allPlans?.map((item) => {
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
          const allActivitiesArr = Object.keys(allActivetie).map((key) => {
            return { label: key.replace("_", " "), value: allActivetie[key] };
          });
          console.log(allActivitiesArr);
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
                      <span style={{ color: theme.palette.primary[400] }}>
                        $
                      </span>
                      <Typography fontSize={70} fontWeight={600}>
                        {item.price}
                      </Typography>
                      <span>/mo</span>
                    </Stack>
                    <Stack spacing={4}>
                      {allActivitiesArr?.map((feat, i) => {
                        console.log("feat", feat);
                        return feat.label !== "Branches" && (
                          <div key={i}>
                            <Grid
                              container
                              sx={{
                                opacity:
                                  feat.value.cards < 0 ||
                                  feat.value.templates > 0
                                    ? 1
                                    : 0.2,
                              }}>
                              <Grid item xs={2} sx={{ textAlign: "center" }}>
                                {feat.value.cards < 0 ||
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
                                    {feat.value.cards === -1 ? (
                                      <AllInclusiveIcon />
                                    ) : (
                                      0
                                    )}
                                  </strong>
                                )}
                              </Grid>
                              <Grid item xs={8}>
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

export default PlansItems;
