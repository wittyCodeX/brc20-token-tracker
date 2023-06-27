import React, { useState } from "react";
import style from "../../styles/component/header.module.css";
import { FaFire } from "react-icons/fa";
import { useEffect } from "react";
import { API } from "../../../Runner/datas";
import axios from "axios";
function Trend() {
  const [data, setData] = useState(null);
  async function GetTrend() {
    try {
      const url = `${API}/trend`;
      const fire = await axios.get(url);
      if (fire.data && fire.data.error == false) {
        setData(fire.data.data);
      }
    } catch (error) {}
  }
  useEffect(() => {
    GetTrend();
  }, []);
  return (
    <>
      {data !== null ? (
        <div className={style.TrendContainer}>
          <div className={style.Trending_text}>
            <span>
              <FaFire size={20} /> <h6>Trending</h6>
            </span>
          </div>
          <div className={style.TrendingContent}>
            <ul>
              {data.map((el, index) => {
                return (
                  <a
                   key={index}
                    href={`/coin/${el.Name}?utm_source=WebsiteTrend&utm_medium=trend_web&utm_campaign=hottoken`}
                  >
                    <span key={index}>
                      <h6 style={{ color: index == 0 ? "red" : "" }}>
                        #{index + 1}
                      </h6>{" "}
                      {el.Name}{" "}
                      <h5
                        style={{
                          color: Number(el.changes) > 0 ? "#19d98b": "#e73842" ,
                        }}
                        className={style.change_trend}
                      >
                        {el.changes ? Number(el.changes).toFixed(2) + "%" : ""}
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
