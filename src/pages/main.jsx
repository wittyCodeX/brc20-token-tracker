import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Head from "next/head";
import {
  GetStatsData,
  getTokenPriceData,
  getRawTokenListFromAPI,
  formatData
} from "../../Runner/datas";
import style from "../styles/main.module.css";
import Footer from "./component/footer";
import Card from "./component/card";
import Gainer from "./component/glv";
import Trend from "./component/trend";

const Main = () => {
  const dispatch = useDispatch();
  const marketStats = useSelector(RootState => RootState.stats);
  const tokenData = useSelector(RootState => RootState.tokenData);
  const [finalData, setFinalData] = useState([]);
  const [isExpandNeeded, setIsExpandNeeded] = useState(false);
  const [offset, setOffset] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [dataPrepared, setDataPrepared] = useState(false);
  const [tokenPriceData, setTokenPriceData] = useState(
    tokenData.tokenPriceData
  );
  const [currentPage, setCurrentPage] = useState(tokenData.currentPage);
  const [offsetFromStart, setOffsetFromStart] = useState(
    tokenData.offsetFromStart
  );
  const [tokenList, setTokenList] = useState(tokenData.tokenList);
  const [tokenPerPage, setTokenPerPage] = useState(tokenData.tokenPerPage);
  
  // get tokenList to display
  const loadTokenData = async index => {
    let returnedData;
    setFinalData([]);
    setIsLoading(true);
    console.log(currentPage);
    console.log(offsetFromStart);
    if (index <= offsetFromStart) {
      // First
      returnedData = getTokenListFromStore(index);
    } else {
      const rawData = await getRawTokenListFromAPI(index, tokenPerPage);
      let formattedData = [];
      for (let i = 0; i < rawData.length; i++) {
          formattedData.push(formatData(null, rawData[i]));
      }
      returnedData = formattedData;
    }
    setFinalData(returnedData);
    setIsLoading(false);
    setCurrentPage(index);
    dispatch({ type: "SET_CURRENT_PAGE", payload: index});
  };

  // get tokenList from store
  const getTokenListFromStore = from => {
    const tokenPerPage = tokenData.tokenPerPage;
    if (from >= 0) return tokenList.slice(from, from + tokenPerPage);
    else return tokenList.slice(from);
  };

  const sortTokenData = index => {};

  useEffect(() => {
    async function getData() {
      const stats = await GetStatsData();
      dispatch({ type: "SET_MARKET_STATS", payload: stats });
    }
    getData();
  }, []);

  useEffect(() => {
    async function getTokens() {
      const tokens = await getTokenPriceData();
      if (tokens && tokens.length > 0) {
        dispatch({ type: "SET_TOKEN_PRICE_DATA", payload: tokens });
        const expectedOffset = Math.ceil(Number(tokens.length) / Number(tokenPerPage)) + offset;
        const rawData = await getRawTokenListFromAPI(0, tokenPerPage * expectedOffset);
        let lastIndex = 0;
        let matchingCount = 0;
        let formattedData = [];
        const priceTokenNameArray = tokens.map(token => token.name);
        const filtered = rawData.filter(token => priceTokenNameArray.includes(token.ticher));
        if (priceTokenNameArray.length === filtered.length) {
          for (let i = 0; i < rawData.length; i++) {
            const priceInfo = tokens.filter(token => {
              rawData[i].ticker === token.name.toLowerCase();
            });
            if (priceInfo.length > 0) {
              formattedData.push(formatData(priceInfo, rawData[i]));
            } else {
              formattedData.push(formatData(null, rawData[i]));
            }
          }
          dispatch({ type: "SET_OFFSET_FROM_START", payload: expectedOffset});
          dispatch({ type: "ADD_TOKEN_LIST", payload: formattedData.sort((a, b) => b.marketCap - a.marketCap) });
          setDataPrepared(true);
        } else {
          setIsExpandNeeded(true);
          const newOffset = offset + 1;
          setOffset(newOffset);
        }
      }
    }
    getTokens();
  }, [isExpandNeeded]);

  useEffect(() => {
    async function loadTokenDataFrom(from) {
      await loadTokenData(from);
      // dispatch({ type: "SET_TOKEN_PRICE_DATA", payload: tokens });
    }
    if (tokenData.tokenPriceData.length > 0) loadTokenDataFrom(currentPage);
  }, [tokenData.tokenPriceData]);

  useEffect(() => {
    setTokenPriceData(tokenData.tokenPriceData);
    setTokenList(tokenData.tokenList);
    setCurrentPage(tokenData.currentPage);
    setOffsetFromStart(tokenData.offsetFromStart);
  }, [tokenData]);

  return (
    <>
      <Head>
        <title>BRC-20 Insider - Live Index site for BRC-20 technology.</title>
        <meta
          name="description"
          content="Live Index site for BRC-20 technology. See the live price, chart, Marketcap of BRC-20 Tokens."
        />
        <meta
          name="keywords"
          content="BRC-20, BRC-20 Token, BRC-20 Insider, BRC-20 Coins, BRC-20 Tracker,  BRC-20 Market, BRC-20 Token Price, BRC-20 mint, New BRC-20 Token, BRC-20 charts, BRC-20 Top Token,"
        />
      </Head>

      {tokenData.tokenPriceData !== null ? (
        <Trend data={tokenData.tokenPriceData} />
      ) : (
        ""
      )}
      {marketStats !== null ? <Card data={marketStats} /> : ""}
      {tokenData.tokenPriceData !== null ? (
        <Gainer data={tokenData.tokenPriceData} />
      ) : (
        ""
      )}

      <main style={{ height: finalData ? "auto" : " 100vh" }}>
        <div className={style.coin_class_table}>
          {!isLoading ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h %</th>
                <th
                  className={style.hide_MC}
                  onClick={() => sortTokenData("marketCap")}
                >
                  Market Cap
                </th>
                <th className={style.hide_V}>Volume (24h)</th>
                <th className={style.hide_S}>Supply</th>
                <th className={style.hide_H}>Holders</th>
                <th className={style.hide_L}>Limit Per Mint</th>
              </tr>
            </thead>
            {finalData && finalData.length > 0
              ? finalData.map((el, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{index + currentPage * tokenPerPage + 1}</td>
                        <td>
                          {" "}
                          <div className={style.coin_logo_front}>
                            {el.iconUrl ? (
                              <img src={el.iconUrl} />
                            ) : (
                              <span>
                                {el.ticker.slice(0, 1)}
                                {el.ticker.slice(-1)}
                              </span>
                            )}
                            <a
                              style={{ textDecoration: "none", color: "white" }}
                              href={`/coin/${el.ticker}?uuid=${el.uuid}`}
                            >
                              <h2 className={style.name}>{el.ticker}</h2>
                            </a>
                          </div>
                        </td>
                        <td>
                          $
                          {el.price != (undefined || null)
                            ? parseFloat(el.price).toFixed(9)
                            : "0.00"}
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
                          {Number(el.marketCap).toLocaleString(undefined, {
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className={style.hide_V}>
                          $
                          {Number(el.volume24h).toLocaleString(undefined, {
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className={style.hide_S}>
                          {Number(el.max).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </td>
                        <td className={style.hide_H}>
                          {Number(el.holdersCount).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </td>
                        <td className={style.hide_L}>
                          {Number(el.limit).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              : ""}
          </table>
          ): (
            <div className={style.chart_loading}>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh"
                }}
              >
                Token List is Loading...
              </span>
            </div>
          )}
          {tokenList ? (
            <div className={style.pagination}>
              <button
                className={style.paginationItem}
                onClick={async () => await loadTokenData(0)}
                disabled={currentPage === 0}
              >
                &laquo;
              </button>
              <button
                className={style.paginationItem}
                onClick={async () => await loadTokenData(currentPage - 1)}
                disabled={currentPage === 0}
              >
                &lt;
              </button>
              <button
                className={style.paginationItem}
                onClick={async () => await loadTokenData(currentPage + 1)}
                disabled={
                  currentPage ===
                  Number(marketStats.totalTokens / tokenPerPage).toFixed(0)
                }
              >
                &gt;
              </button>
              <button
                className={style.paginationItem}
                onClick={async () =>
                  await loadTokenData(
                    Number(marketStats.totalTokens / tokenPerPage).toFixed(0)
                  )
                }
                disabled={
                  currentPage ===
                  Number(marketStats.totalTokens / tokenPerPage).toFixed(0)
                }
              >
                &raquo;
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Main;
