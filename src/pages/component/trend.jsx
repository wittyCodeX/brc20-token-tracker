import React, { useState } from "react";
import style from "../../styles/component/header.module.css";
import { FaFire } from "react-icons/fa";
import { useEffect } from "react";
import { API } from "../../../Runner/datas";
import axios from "axios";
function Trend(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (props.data && props.data.length > 0) {
      const trend = [...props.data].sort((a, b) => b.marketCap - a.marketCap).slice(0, 20);
      setData(trend);

    }
  }, [props.data]);
  return (
    <>
      {props.data !== undefined ? (
        <div className={style.TrendContainer}>
          <div className={style.Trending_text}>
            <span>
              <FaFire size={20} /> <h6>Trending</h6>
            </span>
          </div>
          <div className={style.TrendingContent}>
            <ul>
              {data && data.map((el, index) => {
                return (
                  <a
                   key={index}
                    href={`/coin/${el.symbol}?uuid=${el.uuid}`}
                  >
                    <span key={index}>
                      <h6 style={{ color: index == 0 ? "red" : "" }}>
                        #{index + 1}
                      </h6>{" "}
                      {el.name}{" "}
                      <h5
                        style={{
                          color: Number(el.change) > 0 ? "#19d98b": "#e73842" ,
                        }}
                        className={style.change_trend}
                      >
                        {el.change ? Number(el.change).toFixed(2) + "%" : ""}
                      </h5>
                    </span>
                  </a>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Trend;
