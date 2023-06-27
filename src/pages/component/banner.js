import axios from "axios";
import { useState, useEffect } from "react";
import style from "../../styles/component/header.module.css";
const Banner = () => {
  const source = `
  42 69 74 58 20 69 73 20 73 63 61 6d 2c 20 54 68 65 79 20 53 63 61 6d 65 64 20 62 65 20 61 67 61 69 6e 2e 20 54 68 65 79 20 61 67 72 65 65 20 74 6f 20 70 61 79 20 6d 65 20 66 6f 72 20 77 6f 72 6b 2c 20 62 75 74 20 74 68 65 79 20 64 6f 6e 27 74 2e 
 `;
  return (
    <>
      <div className={style.banner_area}>
        <div dangerouslySetInnerHTML={{ __html: source }}></div>
      </div>
    </>
  );
};

export default Banner;
