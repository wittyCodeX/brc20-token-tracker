import { createChart } from "lightweight-charts";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { getChart } from "./datas";
import style from "../src/styles/coin.module.css";
function chart(props) {
  const chart_ref = useRef();
  const [data, setData] = useState(null);
  async function CreateCharts() {
    const id = props.data.IN;
    const chartData = await getChart(props.data.name, 7);
    setData(chartData);
  }

  useEffect(() => {
    if (data == null) return;

    const option = {
      width: chart_ref.current.clientWidth,
      height: 700,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      layout: {
        background: { color: "transparent" },
        textColor: "#C3BCDB",
      },
      timeScale: {
        borderVisible: false,
      },
      grid: {
        horzLines: {
          color: "#eee",
          visible: false,
        },
        vertLines: {
          color: "rgba(0,0,0,0.3)",
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(12, 28, 16, 0.1)",
          labelVisible: false,
        },
      },
    };
    const chart = createChart(chart_ref.current, option);
    const lineSeries = chart.addAreaSeries({
      topColor: props.data.change > 0 ? "rgb(25, 156, 99)" : "rgb(145, 56, 49)",
      bottomColor: "rgb(0, 0, 0)",
      lineColor: props.data.change > 0 ? "#19d98b" : "#e73842",
      lineWidth: 4,
    });
    console.log(data);
    lineSeries.setData(data);
  }, [data]);

  useEffect(() => {
    if (props) CreateCharts();
  }, [props]);

  return (
    <div className={style.chart}>
      {data !== null ? (
        <div
          style={{
            borderRadius: "11px",
            width: "100%",
            border: "1px solid #2b2b34",
            position: "relative",
            marginTop: "50px",
            display: "block",
          }}
          ref={chart_ref}
        ></div>
      ) : (
        <div className={style.chart_loading}>
          <span>Chart is Loading...</span>
        </div>
      )}
    </div>
  );
}

export default chart;
