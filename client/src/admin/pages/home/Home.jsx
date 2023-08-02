import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  ArrowUpward,
  StorefrontOutlined,
  PaymentOutlined,
} from "@mui/icons-material";
import CardStats from "../../components/Home/CardStats/CardStats";
import LineChart from "../../components/Charts/LineChart/LineChart";
import SyncLineChart from "../../components/Charts/LineChart/SyncLineChart";
import ShapeBarChart from "../../components/Charts/BarChart/ShapeBarChart";
import BarChartNoPadding from "../../components/Charts/BarChart/BarChartNoPadding";
import OrdersTable from "../../components/OrdersTable/OrdersTable";
import { orders } from "../../../utils/mockup/data";
import { useDispatch, useSelector } from "react-redux";
import {
  getActivities,
  getActivitiesChart,
  getCards,
  getCardsChart,
  getCardsCount,
} from "../../../store/statsSlice";
import dayjs from "dayjs";
import ActivitiesChart from "../../components/Charts/ActivitiesChart/ActivitiesChart";
import ActivitiesTable from "../../components/Home/Activities/ActivitiesTable";
function Home() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { cardsCount, cardsChart, activitiesChart,activities } = useSelector(
    (state) => state.stats
  );
  const [businessId, setBusinessId] = useState(2);
  const cards = [
    {
      id: Math.floor(Math.random() * 100000) + 1,
      title: "users",
      number: 200,
      average: 2.4,
      icon: <StorefrontOutlined />,
    },
    {
      id: Math.floor(Math.random() * 100000) + 1,
      title: "cards",
      number: 40,
      average: -7.4,
      icon: <PaymentOutlined />,
    },
    {
      id: Math.floor(Math.random() * 100000) + 1,
      title: "users",
      number: 200,
      average: 2.4,
      icon: <StorefrontOutlined />,
    },
    {
      id: Math.floor(Math.random() * 100000) + 1,
      title: "cards",
      number: 40,
      average: -7.4,
      icon: <PaymentOutlined />,
    },
  ];

  useEffect(() => {
    dispatch(getCardsChart(Last10Days()));
    dispatch(getActivitiesChart(Last10Days()));
    dispatch(getActivities(businessId));
  }, [dispatch]);

  function Last10Days() {
    // Create a new date object for today
    const today = dayjs();

    // Create an array to store the last 10 days
    const last10Days = [];

    // Loop through the past 10 days, including today
    for (let i = 9; i >= 0; i--) {
      // Get the date for i days ago
      const date = today.subtract(i, "day");

      // Add the date to the array
      last10Days.push(date.format("YYYY-MM-DD"));
    }

    // Get the first and last day from the array
    const firstDay = last10Days[0];
    const lastDay = last10Days[last10Days.length - 1];
    const nPoints = 10;

    // Return the array and the first and last day variables
    return { last10Days, firstDay, lastDay, businessId, nPoints };
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
      }}>
      <Grid container spacing={2} p={2}>
        {/* <Grid xs={6} item>
          <Card>
            <CardContent>
              <Typography variant="h3">Hi, Welcome Back Mohammed!</Typography>
              <Typography variant="body2" my={1}>
                You have used the 85% of free plan storage. Please upgrade your
                plan to get unlimited storage.
              </Typography>
              <Button variant="contained" color="primary">
                upgrade
              </Button>
            </CardContent>
          </Card>
        </Grid> */}

        <Grid xs={12} item container spacing={2}>
          {cards.map((item, i) => (
            <Grid xs={6} item key={item.id}>
              <CardStats />
            </Grid>
          ))}
        </Grid>
        <Grid xs={12} md={12} item>
          <Typography
            variant="body1"
            sx={{ p: 2, color: theme.palette.primary[300] }}>
            {" "}
            Card Charts{" "}
          </Typography>
          <Card>
            <CardContent sx={{ height: 500 }}>
              <LineChart myData={cardsChart} />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6} item>
          <Typography
            variant="body1"
            sx={{ p: 2, color: theme.palette.primary[300] }}>
            {" "}
            Activities Charts{" "}
          </Typography>
          <Card>
            <CardContent sx={{ height: 500 }}>
              <ActivitiesChart myData={activitiesChart} />
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={6} item>
          {activities?.length > 0 && <ActivitiesTable data={activities} />}
        </Grid>
        <Grid xs={12} md={6} item>
          {/* <BarChartNoPadding /> */}
        </Grid>
        <Grid xs={12} md={6} item>
          <OrdersTable data={orders} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
