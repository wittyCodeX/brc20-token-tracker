import { createChart } from "lightweight-charts";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import style from "../src/styles/coin.module.css";
import moment from "moment";
import { useSelector } from "react-redux";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import {getGlobalChart} from './datas'

function Gchart() {
  const tokenData = useSelector((RootState) => RootState.tokenData);
  const [priceTokenData, setPriceTokenData] = useState(null);

  const [data, setData] = useState(null);

  
   function CreateCharts() {
    try {
      console.log('calling chart data...')
      const result = getGlobalChart(priceTokenData);
      console.log(result);
      setData(result);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (tokenData.tokenPriceData.length > 0) {
      setPriceTokenData(tokenData.tokenPriceData)
    }
  }, [tokenData.tokenPriceData]);

  useEffect(() => {
    if (priceTokenData) CreateCharts();
  }, [priceTokenData])
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
              {Number(data.totalMarketCap).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </h3>
            <span>{moment(new Date()).format("Y-M-D H:m:s A")}</span>
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
          >
            {data.marketCapHistory != null ? <ResponsiveContainer width='100%' height={400}>
              <AreaChart
                  width={500}
                  height={200}
                  data={data.marketCapHistory.map((val, index) => ({ 'time': `${index} h`, value: val }))}
                  margin={{
                      top: 100,
                      right: 5,
                      left: 0,
                      bottom: 0,
                  }}
              >
                  <XAxis
                      dataKey='time'
                      tick={{ fill: '#19d98b'  }}
                      tickLine={{ stroke: 'white' }}
                  />
                  <YAxis
                      dataKey='value'
                      orientation='right'
                      tick={{ fill: '#19d98b'  }}
                      tickLine={{ stroke: 'white' }}
                  />
                  <Tooltip />
                  <Area type='monotone' dataKey='value' stroke='#279778' fill='#279778' />
              </AreaChart>
            </ResponsiveContainer> :
                <div style={{ width: '100%', height: '200px' }} className='text-center items-center flex justify-center font-extrabold'>
                    --
                </div>
            }
          </div>{" "}
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
              {Number(data.totalVolume).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </h3>
            <span>{moment(new Date()).format("Y-M-D H:m:s A")}</span>
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
          >
            {data.volumeHistory != null ? <ResponsiveContainer width='100%' height={400}>
              <AreaChart
                  width={500}
                  height={200}
                  data={data.volumeHistory.map((val, index) => ({ 'time': `${index} h`, value: val }))}
                  margin={{
                      top: 100,
                      right: 5,
                      left: 0,
                      bottom: 0,
                  }}
              >
                  <XAxis
                      dataKey='time'
                      tick={{ fill: '#19d98b'  }}
                      tickLine={{ stroke: 'white' }}
                  />
                  <YAxis
                      dataKey='value'
                      orientation='right'
                      tick={{ fill: '#19d98b' }}
                      tickLine={{ stroke: 'white' }}
                  />
                  <Tooltip />
                  <Area type='monotone' dataKey='value' stroke='#279778' fill='#279778' />
              </AreaChart>
            </ResponsiveContainer> :
                <div style={{ width: '100%', height: '200px' }} className='text-center items-center flex justify-center font-extrabold'>
                    --
                </div>
            }
          </div>
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
