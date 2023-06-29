import React from "react";
import Image from "next/image";
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
            <a href="https://t.me/INFINITEBTC" target={'_blank'}>
              <Image
                width={200}
                height={200}
                src={`/ad.png`}
                alt="AD"
              />
            </a>
            
            {card.map((el, index) => {
              return (
                <div key={index} className={style.card_item}>
                  <h2>{el.name}:</h2>
                  <span>{el.value}</span>
                </div>
              );
            })}
            <a href="https://antoni-fave-music.netlify.app/" target={'_blank'}>
            <Image
              width={200}
              height={200}
              src="/qrcode.jpg"
              alt="AD"
            />
            </a>
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
