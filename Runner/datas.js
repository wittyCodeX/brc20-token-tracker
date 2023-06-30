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
    volume: 0,
  };
  try {
    const fire = await axios.get(`${UNI_SAT_API}/brc20/status`, {
      // headers: headers,
      params: {
        ticker: "",
        start: 0,
        limit: 1,
        complete: "",
        sort: "deploy",
      },
    });
    if (fire.data && fire.status === 200) {
      stats.totalTokens = fire.data.data.total;
    }
    const response = await axios.get(`${COIN_RANKING_URL}/stats/coins`, {
      headers: headers,
      params: {
        tag: "brc-20",
      },
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
      limit: 200,
    },
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
      sort: "holders",
    },
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
    if (unisatData.data.data && unisatData.status === 200) {
      tokenData = {
        unisat: unisatData.data.data,
        coinranking: {},
      };
      if (coin.uuid !== "") {
        const url = `${COIN_RANKING_URL}/coin/${coin.uuid}`;
        const fire = await axios.get(url, {
          headers: headers,
          params: { referenceCurrencyUuid: "yhjMzLPhuIDl" },
        });
        if (fire.data && fire.status === 200) {
          tokenData = {
            ...tokenData,
            coinranking: fire.data.data,
          };
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
      params: { timePeriod: "24h", referenceCurrencyUuid: "yhjMzLPhuIDl" },
    });
    if (fire.data && fire.status === 200) {
      return fire.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
export function getGlobalChart(tokenList) {
  try {
    let totalMarketHistory = [];
    let totalVolumeHistory = [];
    let totalMarketCap = 0;
    let totalVolume = 0;
    for (let i = 0; i < tokenList.length; i++) {
      let itemMarketData = [];
      let itemVolumeData = [];
      totalMarketCap += Number(tokenList[i].marketCap);
      totalVolume += Number(tokenList[i]["24hVolume"]);
      for (let j = 0; j < tokenList[i].sparkline.length; j++) {
        const marketHistory =
          tokenList[i].marketCap *
          (tokenList[i].sparkline[j] / tokenList[i].price);
        itemMarketData.push(marketHistory);
        const volumeHistory =
          tokenList[i]["24hVolume"] *
          (tokenList[i].sparkline[j] / tokenList[i].price);
        itemVolumeData.push(volumeHistory);
      }
      totalMarketHistory.push(itemMarketData);
      totalVolumeHistory.push(itemVolumeData);
    }
    let marketCapHistory = [];
    let volumeHistory = [];

    if (totalMarketHistory.length > 0) {
      for (let j = 0; j < totalMarketHistory[0].length; j++) {
        let num = totalMarketHistory[0][j];
        for (let i = 1; i < totalMarketHistory.length; i++) {
          num += totalMarketHistory[i][j];
        }
        marketCapHistory.push(num);
      }
    }
    if (totalVolumeHistory.length > 0) {
      for (let j = 0; j < totalVolumeHistory[0].length; j++) {
        let num = totalVolumeHistory[0][j];
        for (let i = 1; i < totalVolumeHistory.length; i++) {
          num += totalVolumeHistory[i][j];
        }
        volumeHistory.push(num);
      }
    }
    return {
      marketCapHistory: marketCapHistory,
      volumeHistory: volumeHistory,
      totalMarketCap: totalMarketCap,
      totalVolume: totalVolume,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const formatData = (priceData, rawData) => {
  if (priceData && rawData) {
    const returned = {
      ticker: rawData.ticker,
      holdersCount: rawData.holdersCount,
      decimal: rawData.decimal,
      limit: rawData.limit,
      minted: rawData.minted,
      max: rawData.max,
      deployedTime: rawData.deployBlocktime,
      inscriptionId: rawData.inscriptionId,
      inscriptionNumberStart: rawData.inscriptionNumberStart,
      volume24h: priceData["24hVolume"],
      price: priceData.price,
      symbol: priceData.symbol,
      marketCap: priceData.marketCap,
      change: priceData.change,
      iconUrl: priceData.iconUrl,
      color: priceData.color,
      uuid: priceData.uuid,
      btcPrice: priceData.btcPrice,
      coinrankingUrl: priceData.coinrankingUrl,
    };
    return returned;
  } else if (!priceData && rawData) {
    const returned = {
      ticker: rawData.ticker,
      holdersCount: rawData.holdersCount,
      decimal: rawData.decimal,
      limit: rawData.limit,
      minted: rawData.minted,
      max: rawData.max,
      deployedTime: rawData.deployBlocktime,
      inscriptionId: rawData.inscriptionId,
      inscriptionNumberStart: rawData.inscriptionNumberStart,
      volume24h: 0,
      price: 0,
      marketCap: 0,
      change: 0,
      iconUrl: "",
      btcPrice: 0,
      color: "#FFF",
      uuid: "",
      symbol: "",
      coinrankingUrl: "",
    };
    return returned;
  } else {
    return null;
  }
};
