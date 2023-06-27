import axios from "axios";

export const API = `https://api.brc20insider.com`;
export default async function GetBRC20() {
  try {
    const url = `${API}/brc20`;
    const fire = await axios.get(url);
    if (fire.data && fire.data.error === false) {
      return fire.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function SearchCoin(q) {
  try {
    const url = `${API}/search?q=${q}`;
    const fire = await axios.get(url);
    if (fire.data && fire.data.error === false) {
      return fire.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getChart(id, time) {
  try {
    const url = `${API}/chart/${id}/${time}`;
    const fire = await axios.get(url);
    if (fire.data && fire.data.error === false) {
      return fire.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
