import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import CrosshairPlugin from "chartjs-plugin-crosshair";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import { useTheme } from "@mui/material";

const ChartLine = ({ myData }) => {
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
      const month = dayjs(date).month() + 1;

      const day = dayjs(date).date();
      dates.push(`${day}/${month}`);
      values.push(point);
    });
    return {
      labels: dates,
      datasets: [
        {
          label: "Cards",
          data: values,
          animations: {
            y: {
              duration: 1000,
              delay: 0,
            },
          },
          fill: true,
          cubicInterpolationMode: "monotone",
          borderColor: themeValues.primary,
          borderWidth: 2,
          pointBackgroundColor: themeValues.primary,
          pointBorderColor: themeValues.primary,
          pointHoverBackgroundColor: themeValues.primary,
          pointHoverBorderColor: themeValues.primary,
          pointRadius: 3,
          pointBorderWidth: 3,
        },
      ],
    };
  }, [themeValues, myData]);

  const config = React.useMemo(() => {
    return {
      type: "bar",
      plugins: [CrosshairPlugin, ChartDataLabels],
      options: {
        // layout: {
        //   padding: 0,
        // },
        // animations: {
        //   y: {
        //     easing: "easeInOutElastic",
        //     from: (ctx) => {
        //       if (ctx.type === "data") {
        //         if (ctx.mode === "default" && !ctx.dropped) {
        //           ctx.dropped = true;
        //           return 0;
        //         }
        //       }
        //     },
        //   },
        // },
        showLine: true,
        
        responsive: true,
        maintainAspectRatio: false,
        
      },
      data,
    };
  }, [themeValues, data, ChartTooltipForCrosshair, Crosshair]);

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

export default React.memo(ChartLine);