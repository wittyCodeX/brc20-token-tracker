import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Head from "next/head";
import {
  GetStatsData,
  getTokenPriceData,
  getRawTokenListFromAPI,
} from "../../Runner/datas";
import style from "../styles/main.module.css";
import Footer from "./component/footer";
import Card from "./component/card";
import Gainer from "./component/glv";
import Trend from "./component/trend";

const Main = () => {
  const dispatch = useDispatch();
  const marketStats = useSelector((RootState) => RootState.stats);
  const tokenData = useSelector((RootState) => RootState.tokenData);
  const [finalData, setFinalData] = useState([]);

  const [tokenPriceData, setTokenPriceData] = useState(tokenData.tokenPriceData);
  const [currentPage, setCurrentPage] = useState(tokenData.currentPage);
  const [offsetFromStart, setOffsetFromStart] = useState(
    tokenData.offsetFromStart
  );
  const [tokenList, setTokenList] = useState(tokenData.tokenList);
  const [offsetFromEnd, setOffsetFromEnd] = useState(tokenData.offsetFromEnd);
  const [tokenPerPage, setTokenPerPage] = useState(tokenData.tokenPerPage);

  // get tokenList to display
  const loadTokenData = async (index) => {
    let returnedData;
    setFinalData([]);

    if (index === 0 || index < 0) {
      // First
      if (tokenList.length >= 0 + tokenPerPage) {
        returnedData = getTokenListFromStore(0);
      } else {
        const rawData = await getRawTokenListFromAPI(0, tokenPerPage);
        returnedData = formatData(rawData);

        dispatch({ type: "ADD_TOKEN_LIST", payload: returnedData });
      }
      setOffsetFromStart(tokenPerPage);
      setCurrentPage(0);
      dispatch({ type: "SET_CURRENT_PAGE", payload: 0 });
      if(tokenList.length === 0) dispatch({ type: "SET_OFFSET_FROM_START", payload: tokenPerPage });
    } else if (index === Number(marketStats.totalTokens / tokenPerPage).toFixed(0)) {
      // Last
      const lastPage = Number(marketStats.totalTokens / tokenPerPage).toFixed(
        0
      );
      const limit = Number(marketStats.totalTokens -  tokenPerPage * lastPage);

      if (offsetFromEnd === 0) {
        setOffsetFromEnd(lastPage * tokenPerPage);
        dispatch({
          type: "SET_OFFSET_FROM_END",
          payload: lastPage * tokenPerPage,
        });
        console.log('from api')
        let rawData;
        if (limit > 0) {
          rawData = await getRawTokenListFromAPI(
            lastPage * tokenPerPage,
            limit
          );
        } else {
          rawData = await getRawTokenListFromAPI(
            (lastPage-1) * tokenPerPage,
            tokenPerPage
          );
        }

        returnedData = formatData(rawData);
        dispatch({ type: "ADD_TOKEN_LIST", payload: returnedData });
      } else if (
        offsetFromEnd > 0 &&
        offsetFromEnd <= lastPage * tokenPerPage
      ) {
        console.log('from store')
        returnedData = getTokenListFromStore(lastPage * tokenPerPage);
      }
      setCurrentPage(lastPage);
      dispatch({ type: "SET_CURRENT_PAGE", payload: lastPage });
    } else if (index > currentPage) { // Next
      const lastPage = Number(marketStats.totalTokens / tokenPerPage).toFixed(
        0
      );

      if (currentPage === lastPage) {
        returnedData = getTokenListFromStore((currentPage) * tokenPerPage);
      } else {
        if (
          ((currentPage + 1) * tokenPerPage < offsetFromStart &&
            offsetFromStart !== 0) ||
          ((currentPage + 1) * tokenPerPage >= offsetFromEnd &&
            offsetFromEnd !== 0)
        ) {
          returnedData = getTokenListFromStore((currentPage + 1) * tokenPerPage);
        } else {
          const rawData = await getRawTokenListFromAPI(
            (currentPage + 1) * tokenPerPage,
            tokenPerPage
          );
          returnedData = formatData(rawData);
          dispatch({
            type: "SET_OFFSET_FROM_START",
            payload: (currentPage + 1) * tokenPerPage + tokenPerPage,
          });
          dispatch({ type: "ADD_TOKEN_LIST", payload: returnedData });
        }
        setCurrentPage(currentPage + 1);
        dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage + 1 });
      }

    } else if (index < currentPage) {
      // Before
      if (
        (currentPage - 1) * tokenPerPage >= offsetFromStart ||
        (currentPage - 1) * tokenPerPage < offsetFromEnd
      ) {
        const rawData = await getRawTokenListFromAPI(
          currentPage * tokenPerPage,
          tokenPerPage
        );
        returnedData = formatData(rawData);
        dispatch({ type: "ADD_TOKEN_LIST", payload: returnedData });
        if (currentPage * tokenPerPage === offsetFromEnd) {
          setOffsetFromEnd((currentPage - 1) * tokenPerPage);
          dispatch({
            type: "SET_OFFSET_FROM_END",
            payload: (currentPage - 1) * tokenPerPage,
          });
        }
      } else {
        returnedData = getTokenListFromStore((currentPage - 1) * tokenPerPage);
      }
      setCurrentPage(currentPage - 1);
      dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage - 1 });
    }
    setFinalData(returnedData);
  };

  const formatData = (rawData) => {
    let formattedData = [];
    const tokenPriceData = tokenData.tokenPriceData;
    for (let i = 0; i < rawData.length; i++) {
      const priceData = tokenPriceData.filter(
        (token) => token.name.toLowerCase() === rawData[i].ticker
      );
      if (priceData && priceData.length > 0) {
        const returned = {
          ticker: rawData[i].ticker,
          holdersCount: rawData[i].holdersCount,
          decimal: rawData[i].decimal,
          limit: rawData[i].limit,
          minted: rawData[i].minted,
          max: rawData[i].max,
          deployedTime: rawData[i].deployBlocktime,
          inscriptionId: rawData[i].inscriptionId,
          inscriptionNumberStart: rawData[i].inscriptionNumberStart,
          volume24h: priceData[0]["24hVolume"],
          price: priceData[0].price,
          symbol: priceData[0].symbol,
          marketCap: priceData[0].marketCap,
          change: priceData[0].change,
          iconUrl: priceData[0].iconUrl,
          color: priceData[0].color,
          uuid: priceData[0].uuid,
          btcPrice: priceData[0].btcPrice,
          coinrankingUrl: priceData[0].coinrankingUrl,
        };
        formattedData.push(returned);
      } else {
        const returned = {
          ticker: rawData[i].ticker,
          holdersCount: rawData[i].holdersCount,
          decimal: rawData[i].decimal,
          limit: rawData[i].limit,
          minted: rawData[i].minted,
          max: rawData[i].max,
          deployedTime: rawData[i].deployBlocktime,
          inscriptionId: rawData[i].inscriptionId,
          inscriptionNumberStart: rawData[i].inscriptionNumberStart,
          volume24h: 0,
          price: 0,
          marketCap: 0,
          change: 0,
          iconUrl: "",
          btcPrice: 0,
          color: "#FFF",
          uuid: "",
          symbol: "",
          coinrankingUrl: "",
        };
        formattedData.push(returned);
      }
    }

    return formattedData;
  };

  // get tokenList from store
  const getTokenListFromStore = (from) => {
    const tokenPerPage = tokenData.tokenPerPage;
    if (from >= 0) return tokenList.slice(from, from + tokenPerPage);
    else return tokenList.slice(from);
  };

  const sortTokenData = (index) => {

  }

  useEffect(() => {
    async function getData() {
      const stats = await GetStatsData();
      dispatch({ type: "SET_MARKET_STATS", payload: stats });
    }
    getData();
  }, []);

  useEffect(() => {
    async function getTokens(from) {
      const tokens = await getTokenPriceData();
      dispatch({ type: "SET_TOKEN_PRICE_DATA", payload: tokens });
    }
    getTokens();
  }, []);

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
    setOffsetFromEnd(tokenData.offsetFromEnd);

    }, [tokenData]);


    console.log(currentPage);
    console.log(Number(marketStats.totalTokens / tokenPerPage).toFixed(0));
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

      {tokenData.tokenPriceData !== null ? <Trend data={tokenData.tokenPriceData} /> : ""}
      {marketStats !== null ? <Card data={marketStats} /> : ""}
      {tokenData.tokenPriceData !== null ? <Gainer data={tokenData.tokenPriceData} /> : ""}

      <main style={{ height: finalData ? "auto" : " 100vh" }}>
        <div className={style.coin_class_table}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h %</th>
                <th className={style.hide_MC} onClick={() => sortTokenData('marketCap')}>Market Cap</th>
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
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={style.hide_V}>
                          $
                          {Number(el.volume24h).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className={style.hide_S}>
                          {Number(el.max).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className={style.hide_H}>
                          {Number(el.holdersCount).toLocaleString(undefined, {
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
          {tokenPriceData && tokenPriceData ? (
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
                disabled={currentPage === Number(marketStats.totalTokens / tokenPerPage).toFixed(0)}
              >
                &gt;
              </button>
              <button
                className={style.paginationItem}
                onClick={async () =>
                  await loadTokenData(Number(marketStats.totalTokens / tokenPerPage).toFixed(0))
                }
                disabled={currentPage === Number(marketStats.totalTokens / tokenPerPage).toFixed(0)}
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
