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
  const dispatch = useDispatch();
  const theme = useTheme();
  const { cardsCount } = useSelector((state) => state.stats);
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
    dispatch(getCardsCount());
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
      }}>
      game
    </Box>
  );
}

export default Home;
