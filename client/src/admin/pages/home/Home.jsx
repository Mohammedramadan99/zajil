import { memo, useEffect, useState } from "react";
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
import ActivitiesChartPoints from "../../components/Charts/ActivitiesChart/ActivitiesChartPoints";
import ActivitiesTable from "../../components/Home/Activities/ActivitiesTable";
import BasicSelect from "../../components/Home/BasicSelect";
import ActivitiesChart from "../../components/Home/Activities/ActivitiesChart";
import CardsChart from "../../components/Home/CardsChart/CardsChart";
import CardsSwiper from "../../components/Home/CardsSwiper/CardsSwiper";
import IndevidualCardSwiper from "../../components/Home/CardsSwiper/IndevidualCardSwiper";
import { useGetBusinesses } from '../../hooks/Businesses'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

function Home() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { businesses } = useSelector((state) => state.businesses);
  const { activities } = useSelector((state) => state.stats);
  const [activitiesTableSelect, setActivitiesTableSelect] = useState(
    (businesses && businesses[0]?.id) || 1
  );
  const [activitiesChartSelect, setActivitiesChartSelect] = useState(
    (businesses && businesses[0]?.id) || 1
  );

  const [businessId, setBusinessId] = useState(
    (businesses && businesses[0]?.id) || 1
  );
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
  function LastnDays(n) {
    const today = dayjs();

    const last10Days = [];

    for (let i = n - 1; i >= 0; i--) {
      const date = today.subtract(i, "day");

      last10Days.push(date.format("YYYY-MM-DD"));
    }

    const firstDay = last10Days[0];
    const lastDay = last10Days[last10Days.length - 1];
    const nPoints = n;

    return { last10Days, firstDay, lastDay, businessId, nPoints };
  }

  // Fetching Data
  // ---- Get Businesses
  const { error, isLoading } = useGetBusinesses();

  useEffect(() => {
    dispatch(getCardsChart(LastnDays(30)));
  }, [dispatch, businessId]);

  useEffect(() => {
    const data = { ...LastnDays(10), businessId: activitiesChartSelect };
    dispatch(getActivitiesChart(data));
  }, [activitiesChartSelect]);

  useEffect(() => {
    dispatch(getActivities(activitiesTableSelect));
  }, [activitiesTableSelect]);
  useEffect(() => {
    dispatch(getCards());  
  }, []);

  // useEffect(() => {
  //   if (businesses?.length <= 0) {
  //     navigate("/admin/business/new")
  //     toast("Please create one business at least.")
  //   }
  // }, [businesses]);
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
        <Grid xs={12} item>
          <CardsSwiper />
        </Grid>
        <Grid xs={12} md={8} item>
          <CardsChart businessId={businessId} setBusinessId={setBusinessId} />
        </Grid>
        <Grid xs={12} md={4} item>
          <IndevidualCardSwiper />
        </Grid>
        <Grid xs={12} md={6} item>
          <ActivitiesChart
            activitiesChartSelect={activitiesChartSelect}
            setActivitiesChartSelect={setActivitiesChartSelect}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          <ActivitiesTable
            activitiesTableSelect={activitiesTableSelect}
            setActivitiesTableSelect={setActivitiesTableSelect}
            data={activities || []}
          />
        </Grid>
        <Grid xs={12} md={6} item>
          {/* <BarChartNoPadding /> */}
        </Grid>
        {/* <Grid xs={12} md={6} item>
          <OrdersTable data={orders} />
        </Grid> */}
      </Grid>
    </Box>
  );
}

export default memo(Home);
