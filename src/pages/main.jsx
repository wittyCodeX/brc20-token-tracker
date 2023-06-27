import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import GetBRC20 from "../../Runner/datas";
import style from "../styles/main.module.css";
import Footer from "./component/footer";
import Card from "./component/card";
import Banner from "./component/banner.js";

const Main = () => {
  const [data, setdata] = useState(null);
  const [newdata, setnewdata] = useState(null);
  useEffect(() => {
    async function getData(Isnew) {
      const Tokens = await GetBRC20();
      Isnew === false ? setdata(Tokens) : setnewdata(Tokens);
    }
    getData(false);
    setInterval(() => {
      getData(true);
    }, 30000);
  }, []);

  function getColor(index) {
    try {
      const OldPrice = data.MarketCapDesc[index].PriceUSD;
      const New = newdata.MarketCapDesc[index].PriceUSD;

      if (Number(OldPrice) > Number(New)) {
        return "#e73842";
      } else if (Number(OldPrice) < Number(New)) {
        return "#19d98b ";
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (newdata !== null && newdata) setdata(newdata);
    }, 2000);
  }, [newdata]);
  return (
    <>
      <title>BRC-20 Insider - Live Index site for BRC-20 technology.</title>
      <meta
        name="description"
        content="Live Index site for BRC-20 technology. See the live price, chart, Marketcap of BRC-20 Tokens."
      />
      <meta
        name="keywords"
        content="BRC-20, BRC-20 Token, BRC-20 Insider, BRC-20 Coins, BRC-20 Tracker,  BRC-20 Market, BRC-20 Token Price, BRC-20 mint, New BRC-20 Token, BRC-20 charts, BRC-20 Top Token,"
      />
      {data !== null ? <Card data={data} /> : ""}

      <Banner />

      <main style={{ height: data ? "auto" : " 100vh" }}>
        <div className={style.coin_class_table}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h %</th>
                <th className={style.hide_MC}>Market Cap</th>
                <th className={style.hide_V}>Volume (24h)</th>
                <th className={style.hide_S}>Supply</th>
                <th className={style.hide_H}>Holders</th>
                <th className={style.hide_L}>Limit Per Mint</th>
              </tr>
            </thead>
            {data !== null
              ? data.MarketCapDesc.map((el, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          {" "}
                          <div className={style.coin_logo_front}>
                            {el.Logo ? (
                              <img src={`../logo/${el.Logo}`} />
                            ) : (
                              <span>
                                {el.name.slice(0, 1)}
                                {el.name.slice(-1)}
                              </span>
                            )}
                            <a
                              style={{ textDecoration: "none", color: "white" }}
                              href={`/coin/${el.name}`}
                            >
                              <h2 className={style.name}>{el.name}</h2>
                            </a>
                          </div>
                        </td>
                        <td
                          style={{
                            color: getColor(index),
                          }}
                        >
                          ${el.PriceUSD}
                        </td>
                        <td>
                          <span
                            className={
                              Number(el.change) > 0 ? style.up : style.down
                            }
                          >
                            {" "}
                            {Number(el.change).toFixed(2)}%
                          </span>
                        </td>
                        <td className={style.hide_MC}>
                          $
                          {Number(el.MarketCap).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={style.hide_V}>
                          $
                          {Number(el.VolumeUSD).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={style.hide_S}>
                          {Number(el.Supply).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className={style.hide_H}>
                          {Number(el.Holder).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className={style.hide_L}>
                          {Number(el.limit).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              : ""}
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Main;
