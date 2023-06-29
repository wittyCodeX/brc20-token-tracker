import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { SearchCoin } from "../../../Runner/datas";
import style from "../../styles/coin.module.css";
import Header from "../component/header";
import Info from "./info";
import Chart from "../../../Runner/chart";
import Footer from "../component/footer";
import Banner from "../component/banner.js";
import { useRouter } from "next/router";
import Loading from "../component/loading";
export async function getServerSideProps(context) {
  const { params } = context;
  return {
    props: { data: params }
  };
}

function Coin(props) {
  const router = useRouter();
  const [token, setToken] = useState();
  const tokenData = useSelector((RootState) => RootState.tokenData);
  useEffect(() => {
    async function loadTokenData() {
      if (props.data) {
        const query = router.query;
        console.log(query);
        const tokenDetail = await SearchCoin(query);
        console.log(tokenDetail);
        setToken(tokenDetail);
      }
    }
    loadTokenData();
  }, [props.data]);
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "block",
          position: "relative"
        }}
      >
        {token !== null && token !== undefined && token.unisat !== null ? (
          <>
            <title>{`${token.unisat.ticker} - BRC-20 Insider`}</title>
            <meta
              name='description'
              content={`Check the Live Price, MarketCap of ${token.unisat.ticker}`}
            />
            <title>{`${token.unisat.ticker} - BRC-20 Insider`}</title>
            <meta
              name='description'
              content={`Check the Live Price, Chart, MarketCap of ${token.unisat.ticker} | ($${token.unisat.ticker}), ${token.unisat.ticker} Token live chart. `}
            />
            <meta
              property='og:title'
              content={`${token.unisat.ticker} Price: ${token.unisat.ticker} Live Price and Chart | BRC-20 Insider`}
            />
            <meta property='og:type' content='website' />
            <meta
              property='og:description'
              content={`See the latest ${token.unisat.ticker} BRC-20 price, market cap, trading volume, Holder, chart and more with BRC-20 Insider&#39;s live ${token.unisat.ticker} price chart and most popular BRC-20 Tokens with BRC-20 Insider.`}
            />
            <meta
              name='keywords'
              content={`${token.unisat.ticker}, $${token.unisat.ticker}, ${token.unisat.ticker} BRC-20, ${token.unisat.ticker} Chart, ${token.unisat.ticker} Price, ${token.unisat.ticker} coin, ${token.unisat.ticker} Token, ${token.unisat.ticker} chart`}
            />
            <meta
              property='og:url'
              content={`https://brc20insider.com/coin/${token.unisat.ticker}`}
            />
            <meta property='og:site_name' content='BRC-20 Insider'></meta>
          </>
        ) : (
          <title>Loading...</title>
        )}
        <Header />
        {/* <Banner /> */}
        <div>
          {token === undefined ? (
            <Loading />
          ) : token !== null ? (
            <>
              <Info data={token} />
              <Chart data={router.query} />
            </>
          ) : (
            <div className={style.notFound}>
              <div>
                <h2>404 </h2>
                <span>Token Not Found :)</span>{" "}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Coin;
