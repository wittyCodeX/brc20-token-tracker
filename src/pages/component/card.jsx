import React from "react";
import style from "../../styles/component/header.module.css";
import Gainer from "./glv";
function card(data) {
  const card = [
    {
      name: "Total Market Cap",
      value: 0,
      value:
        data.data == undefined
          ? 0
          : `$${Number(data.data.Static.TotalMC).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`,
    },
    {
      name: "Total Token",
      value:
        data.data == undefined
          ? 0
          : `${data.data.Static.TotalToken.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`,
    },
    {
      name: "Total Volume(24h)",
      value:
        data.data == undefined
          ? 0
          : `$${data.data.Static.TotalVol.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`,
    },
  ];
  return (
    <>
      {data.data !== null && data.data !== null ? (
        <div className={style.card_main}>
          <div className={style.card_brc}>
            {card.map((el, index) => {
              return (
                <div key={index}>
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
