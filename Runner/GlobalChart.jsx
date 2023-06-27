import { createChart } from "lightweight-charts";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import style from "../src/styles/coin.module.css";
import axios from "axios";
import moment from "moment";

function Gchart() {
  const chart_ref = useRef();
  const mcchart = useRef();
  const Marketchart = useRef();
  const tooltipRef = useRef(null);

  const [CurrentMC, setcurrentMC] = useState({ time: 0, value: 0 });
  const [CurrentV, setcurrentV] = useState({ time: 0, value: 0 });

  const [data, setData] = useState(null);
  async function CreateCharts() {
    try {
      const url = `https://api.brc20insider.com/globalchart`;
      const fire = await axios.get(url);
      if (fire.data && fire.data.error == false) {
        const chartData = fire.data.data.data;
        setData(chartData);
      }
    } catch (error) {}
  }

  function SetDef() {
    try {
      if (data == null) return;
      const Pricing = data.length;
      console.log(Pricing);
      setcurrentMC(() => {
        return {
          value: data[0].MarketCap,
          time: Number(data[0].date),
        };
      });
      setcurrentV(() => {
        return {
          value: data[0].Volume,
          time: Number(data[0].date),
        };
      });
    } catch (error) {}
  }

  useEffect(() => {
    SetDef();
  }, [data]);

  useEffect(() => {
    if (data == null) return;

    //MC

    const MCoption = {
      width: mcchart.current.clientWidth,
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
    Marketchart.current = createChart(mcchart.current, MCoption);
    const MClineSeries = Marketchart.current.addAreaSeries({
      topColor: "rgb(124, 189, 214)",
      bottomColor: "rgb(11, 16, 18)",
      lineColor: "#87CEEB",
      lineWidth: 3,
    });
    const MCchartData = data.map((el) => {
      return {
        time: Number(el.date) / 100,
        value: Number(el.MarketCap),
      };
    });
    MClineSeries.setData(MCchartData.reverse());

    Marketchart.current.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData) {
        const seriesData = Array.from(param.seriesData.values())[0];
        if (seriesData && seriesData.value) {
          const price = seriesData.value.toFixed(2);
          const time = param.time;
          setcurrentMC(() => {
            return { value: price, time: time * 100 };
          });
        } else {
          SetDef();
        }
      } else {
        SetDef();
      }
    });

    // Cleanup function
    return () => {
      // Destroy the chart to prevent memory leaks
      Marketchart.current?.remove();
    };
  }, [data]);

  useEffect(() => {
    if (data == null) return;

    //Volume
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
      topColor: "rgb(124, 189, 214)",
      bottomColor: "rgb(11, 16, 18)",
      lineColor: "#87CEEB",
      lineWidth: 3,
    });
    const chartData = data.map((el) => {
      return {
        time: Number(el.date) / 100,
        value: Number(el.Volume),
      };
    });
    lineSeries.setData(chartData.reverse());
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData) {
        const seriesData = Array.from(param.seriesData.values())[0];
        if (seriesData && seriesData.value) {
          const price = seriesData.value.toFixed(2);
          const time = param.time;
          setcurrentV(() => {
            return { value: price, time: time * 100 };
          });
        } else {
          SetDef();
        }
      } else {
        SetDef();
      }
    });
    return () => {
      // Destroy the chart to prevent memory leaks
      chart?.remove();
    };
  }, [data]);

  useEffect(() => {
    CreateCharts();
  }, []);
  return (
    <div className={style.chart}>
      {data !== null ? (
        <>
          <div>
            <h2
              style={{
                color: "white",
                textAlign: "center",
                fontSize: "18px",
                fontFamily: "'roboto',san-serif",
              }}
            >
              Volume of BRC-20 Allocation (USD)
            </h2>
          </div>
          <div className={style.Price_display}>
            <h3>
              $
              {Number(CurrentV.value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </h3>
            <span>{moment(CurrentV.time).format("Y-M-D H:m:s A")}</span>
          </div>
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
          ></div>{" "}
          <div style={{ display: "block", marginTop: "50px" }}>
            <h2
              style={{
                color: "white",
                textAlign: "center",
                fontSize: "18px",
                fontFamily: "'roboto',san-serif",
              }}
            >
              Market Cap of BRC-20 Allocation (USD)
            </h2>
          </div>
          <div className={style.Price_display}>
            <h3>
              $
              {Number(CurrentMC.value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </h3>
            <span>{moment(CurrentMC.time).format("Y-M-D H:m:s A")}</span>
          </div>
          <div
            style={{
              borderRadius: "11px",
              width: "100%",
              border: "1px solid #2b2b34",
              position: "relative",
              marginTop: "50px",
              display: "block",
            }}
            ref={mcchart}
          ></div>
        </>
      ) : (
        <div className={style.chart_loading}>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            Chart is Loading...
          </span>
        </div>
      )}
    </div>
  );
}

export default Gchart;
