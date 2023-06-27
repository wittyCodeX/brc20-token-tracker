import axios from "axios";
import React from "react";
import { API } from "../../../Runner/datas";
import style from "../../styles/coin.module.css";
import Header from "../component/header";
import Info from "./info";
import Chart from "../../../Runner/chart";
import Footer from "../component/footer";
import Banner from "../component/banner.js"
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const url = `${API}/brc20/${id}`;
    const fire = await axios.get(url);
    if (fire.data.error == false) {
      return {
        props: {
          token: fire.data.data,
        },
      };
    }
    return { props: { token: null, error:"error" } };
  } catch (error) {
    return { props: { token: null , error:error } };
  }
}

function Coin(props) {
  
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          display: "block",
          position: "relative",
        }}
      >
        { 
   props.token !== null ? (
          <>
            <title>{`${props.token.name} - BRC-20 Insider`}</title>
            <meta
              name="description"
              content={`Check the Live Price, MarketCap of ${props.token.name}`}
            />
            <title>{`${props.token.name} - BRC-20 Insider`}</title>
            <meta
              name="description"
              content={`Check the Live Price, Chart, MarketCap of ${props.token.name} | ($${props.token.name}), ${props.token.name} Token live chart. `}
            />
            <meta
              property="og:title"
              content={`${props.token.name} Price: ${props.token.name} Live Price and Chart | BRC-20 Insider`}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:description"
              content={`See the latest ${props.token.name} BRC-20 price, market cap, trading volume, Holder, chart and more with BRC-20 Insider&#39;s live ${props.token.name} price chart and most popular BRC-20 Tokens with BRC-20 Insider.`}
            />
            <meta
              name="keywords"
              content={`${props.token.name}, $${props.token.name}, ${props.token.name} BRC-20, ${props.token.name} Chart, ${props.token.name} Price, ${props.token.name} coin, ${props.token.name} Token, ${props.token.name} chart`}
            />
            <meta
              property="og:url"
              content={`https://brc20insider.com/coin/${props.token.name}`}
            />
            <meta property="og:site_name" content="BRC-20 Insider"></meta>
          </>
        ) : (
          <title>Loading...</title>
        )}
        <Header />
         <Banner/>
        <div>
          {props.token !== null ? (
            <>
              <Info data={props.token} />
              <Chart data={props.token} />
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
