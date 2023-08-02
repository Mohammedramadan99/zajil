import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import CrosshairPlugin from "chartjs-plugin-crosshair";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import { useTheme } from "@mui/material";

const ActivitiesChart = ({ myData }) => {
  // const { themeValues } = useSelector((state) => state.settings);
  const theme = useTheme();
  const themeValues = {
    primary: theme.palette.primary[300],
  };
  const chartContainer = useRef(null);
  const ChartTooltipForCrosshair = React.useMemo(() => {
    return {
      enabled: true,
      position: "nearest",
      // backgroundColor: themeValues.foreground,
      // titleColor: themeValues.primary,
      // titleFont: themeValues.font,
      bodySpacing: 10,
      // bodyColor: themeValues.body,
      // bodyFont: themeValues.font,
      padding: 15,
      // cornerRadius: parseInt(themeValues.borderRadiusMd, 10),
      displayColors: false,
      // borderColor: themeValues.separator,
      borderWidth: 1,
      intersect: false,
      mode: "index",
    };
  }, [themeValues]);
  const Crosshair = React.useMemo(() => {
    return {
      sync: {
        enabled: true,
      },
      zoom: {
        enabled: false,
      },
      line: {
        // color: themeValues.separator,
        width: 1,
      },
    };
  }, [themeValues]);
  const data = React.useMemo(() => {
    const dates = []; // array to hold the labels for x-axis
    const values = []; // array to hold the values for y-axis
    myData?.forEach((item) => {
      const { point, date } = item;
      const month = dayjs(date).month();
      const day = dayjs(date).date();
      dates.push(`${day}/${month}`);
      values.push(point);
    });
    return {
      labels: dates,
      datasets: [
        {
          label: "Activities",
          data: values,
          fill: false,
          cubicInterpolationMode: "monotone",
          borderColor: themeValues.primary,
          borderWidth: 2,
          pointStyle: "rectRot",
          pointRadius: 5,
          pointBorderColor: theme.palette.primary[100],
        },
      ],
    };
  }, [themeValues, myData]);

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        crosshair: Crosshair,
        datalabels: false,
        tooltip: ChartTooltipForCrosshair,

        streaming: false,
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
      scales: {
        y: {
          type: "linear",
          grid: {
            display: true,
            lineWidth: 1,
            // color: themeValues.separatorLight,
            drawBorder: false,
            drawTicks: true,
          },
          ticks: {
            padding: 8,
            stepSize: 1,
            // fontColor: themeValues.alternate,
          },
        },
        x: {
          type: "category",
          grid: {
            display: false,
            drawTicks: true,
            drawBorder: true,
          },
          // ticks: { fontColor: themeValues.alternate },
        },
      },
    },
  };

  useEffect(() => {
    let myChart = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables);

      myChart = new Chart(chartContainer.current, config);
    }
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ActivitiesChart);
