import { useEffect } from "react";
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
import { getCards, getCardsCount } from "../../../store/statsSlice";

function Home() {
  const dispatch = useDispatch()
  const theme = useTheme();
  const {cardsCount} = useSelector(state => state.stats)
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
    
      dispatch(getCardsCount())
    
  }, [dispatch])
  
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
        <Grid xs={12} md={6} item>
          <LineChart />
        </Grid>
        <Grid xs={12} md={6} item>
          <SyncLineChart />
        </Grid>
        <Grid xs={12} md={6} item>
          <ShapeBarChart />
        </Grid>
        <Grid xs={12} md={6} item>
          <BarChartNoPadding />
        </Grid>
        <Grid xs={12} md={6} item>
          <OrdersTable data={orders} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
