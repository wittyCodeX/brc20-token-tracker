import style from "../../styles/coin.module.css";
import React, { useState, useEffect } from "react";
import moment from "moment";

const Info = (data) => {
  const links = [
    { name: "website", ref: "" },
    { name: "Telegram", ref: "" },
    { name: "Discord", ref: "" },
    { name: "Twitter", ref: "" },
  ];
  const [headActive, setHeadActive] = useState(false);

  function GetHead() {
    if (window.scrollY >= 210) {
      setHeadActive(true);
    } else {
      setHeadActive(false);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", GetHead);
  }, [headActive]);
  return (
    <>
      {data !== null && data !== undefined ? (
        <div className={style.coin_Self}>
          <div className={style.coin_basic}>
            <div>
              {/* Name */}

              <div className={style.coinName}>
                {data.data.coinranking.coin?.iconUrl ? (
                  <img
                    className={style.coinlogo}
                    src={data.data.coinranking.coin?.iconUrl}
                  />
                ) : (
                  <span>
                    {" "}
                    {data.data.unisat.ticker.slice(0, 1)}
                    {data.data.unisat.ticker.slice(-1)}
                  </span>
                )}{" "}
                <h2>{data.data.unisat.ticker}</h2>
              </div>
            </div>
            <div>
              <div className={style.coinprice}>
                <span>
                  {data.data.unisat.name} Price{" "}
                  <span className={style.name_extra}>({data.data.unisat.ticker})</span>
                </span>
                <h2>
                  ${data.data.coinranking.coin?.price? Number(data.data.coinranking.coin?.price).toFixed(6): 0}{" "}
                  <span
                    style={{
                      color: data.data.coinranking.coin?.change < 0 ? "#e73842" : "#19d98b",
                    }}
                  >
                    { data.data.coinranking.coin?.change ? data.data.coinranking.coin?.change: 0 }%
                  </span>
                </h2>
                <span className={style.hideMp}>
                  {data.data.coinranking.coin?.btcPrice? data.data.coinranking.coin?.btcPrice: 0} Sats
                </span>
              </div>
              {/* Price */}
            </div>
            <div>
              <div className={style.coinprice}>
                <span>Market Cap </span>
                <h2 className={style.MarketCap}>
                  $
                  {Number(data.data.coinranking.coin?.marketCap?data.data.coinranking.coin?.marketCap: 0 ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
              {/* Market Cap */}
            </div>
            <div>
              <div className={style.coinprice}>
                <span>Volume 24h </span>
                <h2 className={style.MarketCap}>
                  $
                  {Number(data.data.coinranking.coin? data.data.coinranking.coin['24hVolume']: 0).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </h2>
                {/* Volume */}
              </div>
            </div>
          </div>

          <div className={style.min_info}>
            <div className={style.extraBar}>
              <div className={style.extraBar_handelr}>
                <div className={style.extraBar_name}>
                  <span>Holder</span>
                  <h2 className={style.extraBar_value}>
                    {Number(data.data.unisat.holdersCount).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                  {/* Volume */}
                </div>
              </div>
              <div className={style.extraBar}>
                <div className={style.extraBar_name}>
                  <span>Limit/Mint</span>
                  <h2 className={style.extraBar_value}>
                    {Number(data.data.unisat.limit).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                  {/* Volume */}
                </div>
              </div>
              <div className={style.extraBar}>
                <div className={style.extraBar_name}>
                  <span>Total Supply</span>
                  <h2 className={style.extraBar_value}>
                    {Number(data.data.unisat.totalMinted).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                  {/* Volume */}
                </div>
              </div>
              <div className={style.extraBar}>
                <div className={style.extraBar_name}>
                  <span>Deployed Date</span>
                  <h2 className={style.extraBar_value}>
                    {moment(data.data.unisat.deployBlocktime * 1000).format("Y-M-D")} (
                    {moment(data.data.unisat.deployBlocktime * 1000).fromNow()})
                  </h2>
                  {/* Volume */}
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className={style.social}>
            <ul>
              {links.map((el, indx) => {
                return (
                  <a key={indx} href={el.ref}>
                    <span>{el.name}</span>
                  </a>
                );
              })}
            </ul>
          </div>
          <div
            style={{ top: headActive ? "0%" : "-100%" }}
            className={style.mobile_price}
          >
            <div className={style.MobilePrice}>
              <div>
                <span className={style.nonLogo}>
                  {data.data.unisat.ticker.slice(0, 1)}
                  {data.data.unisat.ticker.slice(-1)}
                </span>
                <h2>{data.data.unisat.ticker}</h2>
              </div>
              <span className={style.PriceUSD}>${data.data.coinranking.coin?.price}</span>
            </div>
          </div>
          <hr className={style.seperator} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Info;
