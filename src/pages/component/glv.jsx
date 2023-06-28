//Gainer Looser Volume

import React from "react";
import { useState, useEffect } from "react";
import style from "../../styles/component/header.module.css";
function Gainer(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      const data1 = [...props.data];
      const data2 = [...props.data];
      const changeOrder = data1.sort((a, b) => a.change - b.change)
      const volumeOrder = data2.sort((a, b) => b.marketCap - a.marketCap)
      setData({
        Gainer: changeOrder.slice(-4),
        Looser: changeOrder.slice(0, 4),
        VolumeUSD: volumeOrder.slice(0, 4)
      });
    }
  }, [props.data])

  return (
    <div>
      {data !== null ? (
        <div className={style.gainer_container}>
          <div className={style.gainer_main}>
            <div className={style.gainer_content}>
              <div className={style.gc_head}>
                <h2>⬆️ Top Gainer</h2>
              </div>
              <div className={style.content_g}>
                <ul>
                  {data.Gainer.map((el, index) => {
                    return (
                      <a href={`/coin/${el.symbol}?uuid=${el.uuid}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.name}
                        </h3>
                        <h6 style={{ color: "#19d98b" }}>
                          +{Number(el.change.replace("-", "+")).toFixed(2)}%
                        </h6>
                      </a>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className={style.gainer_content}>
              <div className={style.gc_head}>
                <h2>⬇️ Top Looser</h2>
              </div>{" "}
              <div className={style.content_g}>
                <ul>
                  {data.Looser.map((el, index) => {
                    return (
                      <a href={`/coin/${el.symbol}?uuid=${el.uuid}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.name}
                        </h3>
                        <h6 style={{ color: "#e73842" }}>
                          -
                          {Number(
                            Number(el.change) < 100
                              ? el.change.replace("-", "")
                              : "100"
                          ).toFixed(2)}
                          %
                        </h6>
                      </a>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className={style.gainer_content}>
              <div className={style.gc_head}>
                <h2>🔥 Top Volume</h2>
              </div>{" "}
              <div className={style.content_g}>
                <ul>
                  {data.VolumeUSD.map((el, index) => {
                    return (
                      <a href={`/coin/${el.symbol}?uuid=${el.uuid}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.name}
                        </h3>
                        <h6>
                          $
                          {Number(el.marketCap).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </h6>
                      </a>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

module.exports = Gainer;
