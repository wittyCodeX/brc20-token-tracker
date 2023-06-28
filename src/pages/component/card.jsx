import React from "react";
import style from "../../styles/component/header.module.css";
import Gainer from "./glv";
function card(props) {
  const data = props.data;
  const card = [
    {
      name: "Total Market Cap",
      value: 0,
      value:
        data == undefined
          ? 0
          : `$${Number(data.marketCap).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`,
    },
    {
      name: "Total Token",
      value:
        data == undefined
          ? 0
          : `${Number(data.totalTokens).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`,
    },
    {
      name: "Total Volume(24h)",
      value:
        data == undefined
          ? 0
          : `$${Number(data.volume).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`,
    },
  ];
  return (
    <>
      {data !== null ? (
        <div className={style.card_main}>
          <div className={style.card_brc}>
            {card.map((el, index) => {
              return (
                <div key={index} className={style.card_item}>
                  <h2>{el.name}:</h2>
                  <span>{el.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
      <Gainer />
    </>
  );
}

export default card;
