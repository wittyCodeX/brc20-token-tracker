import Header from "./component/header";
import Head from "next/head";
import Main from "./main";
export default function Home() {
  return (
    <>
      <Head>
        <title>BRC-20 Insider - Live Index site for BRC-20 technology.</title>
        <meta
          name='description'
          content='Live Index site for BRC-20 technology. See the live price, chart, Marketcap of BRC-20 Tokens.'
        />
        <meta
          name='keywords'
          content='BRC-20, BRC-20 Token, BRC-20 Insider, BRC-20 Coins, BRC-20 Tracker,  BRC-20 Market, BRC-20 Token Price, BRC-20 mint, New BRC-20 Token, BRC-20 charts, BRC-20 Top Token,'
        />
        <meta
          property='og:title'
          content={`Live Price and Chart | BRC-20 Insider`}
        />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content={`Live Index site for BRC-20 technology. See the live price, chart, Marketcap of BRC-20 Tokens.`}
        />
        <meta property='og:url' content={`https://brc20insider.com/`} />
        <meta property='og:site_name' content='BRC-20 Insider'></meta>
        <meta
          property='og:image'
          content='https://brc20insider.com/logo.png'
        ></meta>
        <meta property='og:image:type' content='image/png'></meta>
        <meta property='og:image:width' content='2000'></meta>
        <meta property='og:image:height' content='2000'></meta>
        <meta property='og:image:alt' content='Logo'></meta>
      </Head>
      <Header />
      <Main />
    </>
  );
}
