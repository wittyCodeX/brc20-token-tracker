import React from "react";
import style from "../../styles/component/header.module.css";

export default function footer() {
  return (
    <div className={style.footer}>
      <footer>
        <div className={style.footer_social}>
          <span>
            <a href="https://t.me/BRC20coins">Telegram</a>
          </span>
          <span>
            <a href="https://twitter.com/insiderbrc20">Twitter</a>
          </span>
          <span>
            <a href="https://discord.com/invite/wahyKHBZPG">Discord</a>
          </span>
        </div>
        <div className={style.copyright}>
          <span>BRC-20 Insider © 2023 - insiderbrc20@gmail.com</span>
        </div>
      </footer>
    </div>
  );
}
