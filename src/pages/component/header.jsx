import React, { useState } from "react";
import style from "../../styles/component/header.module.css";
import * as AIicon from "react-icons/ai";
import * as FIicons from "react-icons/fa";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import Trend from "./trend";
function Header() {
  const tokenData = useSelector((RootState) => RootState.tokenData);

  const headerData = [
    { name: "BRC-20 Tokens", ref: "/", span: "" },
    { name: "Global BRC-20 Chart", ref: "/global", span: "new" },
    { name: "Marketplace", ref: "https://oxdx.xyz/", span: "soon" },
    { name: "Product", ref: "/", span: "soon" },
  ];
  const divRef = useRef();
  const [q, setq] = useState(null);
  const [sl, setsl] = useState(true);
  const [showMB, setShowMB] = useState(false);

  const [data, setdata] = useState(null);
  const [priceTokenData, setPriceTokenData] = useState(null);
  async function SearchHandler(e) {
    if (e.keyCode === 13) {
      const tokenWithUUID = priceTokenData.filter((token) => token.name.toLowerCase() === q.toLowerCase());
      if  (tokenWithUUID.length > 0) {
        location.href = "/coin/" + q + "?uuid=" + tokenWithUUID[0].uuid;
      } else {
        location.href = "/coin/" + q + "?uuid=";
      }
    }
  }
  useEffect(() => {
    setPriceTokenData(tokenData.tokenPriceData)
  }, [tokenData.tokenPriceData]);

  useEffect(() => {
    const ChekIFOutside = (e) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setdata(null);
      }
    };
    document.addEventListener("mousedown", ChekIFOutside);
    return () => {
      document.removeEventListener("mousedown", ChekIFOutside);
    };
  }, [sl]);
  return (
    <>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://brc20insider.com/logo.png"
      />

      <div className={style.navmain}>
        <div className={style.nav_handler}>
          <div className={style.navItem}>
            <div className={style.brand}>
              <img src={"../logo/logo.png"} /> <h2> BRC-20 Insıder </h2>
            </div>
            <div className={style.link}>
              <ul>
                {headerData.map((el, index) => {
                  return (
                    <li key={index}>
                      <a href={el.ref}>{el.name}</a>
                      <span>{el.span}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div ref={divRef} className={style.search}>
            <input
              type="text"
              placeholder="Search BRC20 Tokens...."
              name="search"
              autoComplete="off"
              style={{
                borderBottomLeftRadius: sl === true ? "8px" : "0px",
                borderBottomRightRadius: sl === true ? "8px" : "0px",
              }}
              onClick={(e) => {
                setsl(false);
              }}
              onChange={(e) => {
                setq(e.target.value);
              }}
              onKeyUp={(e) => {
                SearchHandler(e)
              }}
            />{" "}
            <div className={style.search_token}>
              {data !== null ? (
                <div className={style.searchRes}>
                  <ul>
                    {data.map((el, index) => {
                      return (
                        <li key={index}>
                          <a href={`/coin/${el.Name}`}>
                            <h2>{el.Name}</h2>
                            <span>{el.PriceUSD ? `$${el.PriceUSD}` : ""}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>{" "}
          </div>
          <div className={style.bar}>
            <span
              onClick={() => {
                setShowMB(!showMB);
              }}
            >
              <FIicons.FaBars size={"29"} />
            </span>
          </div>
        </div>
        <div
          style={{ left: showMB ? "0%" : "-100%" }}
          className={style.mobileBar}
        >
          <div className={style.closeButton}>
            <span
              onClick={() => {
                setShowMB(!showMB);
              }}
            >
              <AIicon.AiFillCloseCircle size={"29px"} />
            </span>
          </div>
          <div className={style.mobile_items}>
            <ul>
              {headerData.map((el, index) => {
                return (
                  <li key={index}>
                    <a href={el.ref}>{el.name}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div></div>
      </div>
      <Trend />
    </>
  );
}

export default Header;
