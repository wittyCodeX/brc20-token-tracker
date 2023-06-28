import axios from "axios";
import { useSelector } from "react-redux";
export const COIN_RANKING_API = "https://api.coinranking.com/v2";
export const COIN_RANKING_URL = "https://coinranking.com/api/v2";
export const UNI_SAT_API = "https://unisat.io/brc20-api-v2";

const headers = { "x-access-token": process.env.COIN_RAKING_API_KEY };
export async function GetStatsData() {
  let stats = {
    totalTokens: 0,
    marketCap: 0,
    volume: 0
  };
  try {
    const fire = await axios.get(`${UNI_SAT_API}/brc20/status`, {
      // headers: headers,
      params: {
        ticker: "",
        start: 0,
        limit: 1,
        complete: "",
        sort: "deploy"
      }
    });
    if (fire.data && fire.status === 200) {
      stats.totalTokens = fire.data.data.total;
    }
    const response = await axios.get(`${COIN_RANKING_URL}/stats/coins`, {
      headers: headers,
      params: {
        tag: "brc-20"
      }
    });

    if (response.data && response.status === 200) {
      stats.marketCap = response.data.data.stats.marketCap;
      stats.volume = response.data.data.stats.volume;
    }
    return stats;
  } catch (error) {
    console.log(error);
    return stats;
  }
}

export const getTokenPriceData = async () => {
  const maxToken = 10;
  let validTokens = [];
  const response = await axios.get(`${COIN_RANKING_API}/coins`, {
    headers: headers,
    params: {
      tags: ["brc-20"],
      limit: 200
    }
  });

  if (response.data && response.status === 200) {
    validTokens = response.data.data.coins.filter(
      (token) => token.price != null
    );
  }
  return validTokens;
};

export const getRawTokenListFromAPI = async (from, limit) => {
  let validTokens = [];
  // https://unisat.io/brc20-api-v2/brc20/status?ticker=&start=34953&limit=55&complete=&sort=deploy
  const response = await axios.get(`${UNI_SAT_API}/brc20/status`, {
    params: {
      ticker: "",
      start: from,
      limit: limit,
      complete: "",
      sort: "deploy"
    }
  });
  if (response.data && response.status === 200) {
    validTokens = response.data.data.detail;
  }
  https: return validTokens;
};

export async function SearchCoin(coin) {
  try {
    let tokenData;
    const unisatData = await axios.get(
      `${UNI_SAT_API}/brc20/${coin.id.toLowerCase()}/info`
    );
    console.log(unisatData);
    if (unisatData.data && unisatData.status === 200) {
      tokenData = unisatData.data.data;
      if (coin.uuid !== "") {
        const url = `${COIN_RANKING_URL}/coin/${coin.uuid}`;
        const fire = await axios.get(url, {
          headers: headers,
          params: { referenceCurrencyUuid: "yhjMzLPhuIDl" }
        });
        if (fire.data && fire.status === 200) {
          tokenData = [tokenData, fire.data.data];
        }
      }
      return tokenData;
    }
    return null;
  } catch (error) {
    return null;
  }
}
// https://coinranking.com/api/v2/coin/j7-7vPrOi/history?timePeriod=7d&referenceCurrencyUuid=yhjMzLPhuIDl
export async function getChart({ uuid, ticker }) {
  try {
    const url = `${COIN_RANKING_URL}/coin/${uuid}/history`;
    const fire = await axios.get(url, {
      headers: headers,
      params: { timePeriod: "24h", referenceCurrencyUuid: "yhjMzLPhuIDl" }
    });
    if (fire.data && fire.status === 200) {
      return fire.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
