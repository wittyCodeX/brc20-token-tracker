//Gainer Looser Volume

import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API } from "../../../Runner/datas";
import style from "../../styles/component/header.module.css";
function Gainer() {
  const [data, setdata] = useState(null);
  async function GetData() {
    try {
      const url = `${API}/gainer`;
      const fire = await axios.get(url);
      if (fire.data && fire.data.error === false) {
        setdata(fire.data.data);
      }
    } catch (error) {}
  }

  useEffect(() => {
    GetData();
  }, []);
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
                      <a href={`/coin/${el.Name}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.Name}
                        </h3>
                        <h6 style={{ color: "#19d98b" }}>
                          +{Number(el.Changes.replace("-", "+")).toFixed(2)}%
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
                      <a href={`/coin/${el.Name}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.Name}
                        </h3>
                        <h6 style={{ color: "#e73842" }}>
                          -
                          {Number(
                            Number(el.Changes) < 100
                              ? el.Changes.replace("-", "")
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
                      <a href={`/coin/${el.Name}`} key={index}>
                        <h3>
                          <span>{index + 1}</span> {el.Name}
                        </h3>
                        <h6>
                          $
                          {Number(el.VolumeUSD).toLocaleString(undefined, {
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
