import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import AnimatedNumber from "@layouts/components/AnimateNumber";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import Table from "@layouts/components/Table";
import axios from "axios";
import Link from "next/link";
import ImageFallback from "@layouts/components/ImageFallback";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipseSharp } from "react-icons/io5";

const { blog_folder } = config.settings;

const Home = () => {
  const unisat = useSelector((state) => state.unisat);
  const ranking = useSelector((state) => state.ranking);
  const [hasValueAndMatchQueryTokens, setHasValueAndMatchQueryTokens] =
    useState([]);
  const [hasPriceNameArray, setHasPriceNameArray] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [presentHasValueCount, setPresentHasValueCount] = useState(0);
  const [matchQueryValueCount, setMatchQueryValueCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [tokenData, setTokenData] = useState({});
  const [marketData, setMarketData] = useState({});

  var unisatTokenDetail = [];
  const unisatTokens = unisat.detail;
  var hasPriceObjectArray;
  const query = unisat.query;

  const dispatch = useDispatch();

  const option = {
    headers: {
      "x-access-token": process.env.COINRAKING_API_KEY,
    },
    params: {
      tags: ["brc-20"],
      limit: 200,
    },
  };
  /*
  const showDetailPage = (uuid) => {
      if (uuid != undefined) {
          const option = {
              headers: {
                  'x-access-token': process.env.COINRAKING_API_KEY
              },
          }
          const options = {
              headers: {
                  'x-access-token': process.env.COINRAKING_API_KEY
              },
              params: {
                  referenceCurrencyUuid: 'yhjMzLPhuIDl'
              }
          }
          async function fetchData() {
              axios.get(`https://api.coinranking.com/v2/coin/${uuid}`, option).then((coindata) => {
                  setTokenData(coindata.data.data.coin)
                  axios.get(`https://coinranking.com/api/v2/coin/${uuid}/markets`, options).then((market) => {
                      setMarketData(market.data.data)
                  })
              });
          }
          fetchData();
      }
  }

  const loading = () => {
      return (
          <div className='w-10/12 m-auto h-[100px]  flex items-center justify-center'>
              <div role="status m-auto py-8">
                  <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
          </div>
      )
  }
*/

  async function fetchData() {
    // remove event on unmount to prevent a memory leak
    loadString(10);
    const unisatData = await axios.get(
      `https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=0&limit=1&complete=&sort=deploy`
    );
    dispatch({ type: "GET_UNISAT_DATA", payload: unisatData.data.data });
    const coindata = await axios.get(
      "https://api.coinranking.com/v2/coins",
      option
    );
    const statsData = await axios.get(
      "https://coinranking.com/api/v2/stats/coins",
      {
        headers: { "x-access-token": process.env.COINRAKING_API_KEY },
        params: {
          tags: "brc-20",
          referenceCurrencyUuid: "yhjMzLPhuIDl",
          timePeriod: "24h",
        },
      }
    );
    dispatch({ type: "GET_RANKING_TOTAL", payload: statsData.data.data.stats });
    unisatTokenDetail = unisatData.data.data.detail;

    setTotalTokens((prev) => unisatData.data.data.total);
    // document.getElementById('spinner').style.display = 'none';

    hasPriceObjectArray = coindata.data.data.coins.filter(
      (token) => token.price != null
    );
    let hasValueDemo = hasPriceObjectArray.filter((one) =>
      one.name.toLowerCase().includes(query.toLowerCase())
    );
    setHasValueAndMatchQueryTokens(hasValueDemo);
    setHasPriceNameArray(hasValueDemo.map((token) => token.name.toLowerCase()));

    setMatchQueryValueCount(hasValueDemo.length);
    //goto(0);
  }

  useEffect(() => {
    //window.addEventListener("scroll", onScroll, { passive: true });
    fetchData();
  }, []);

  useEffect(() => {
    if (totalTokens > 0) goto(0);
  }, [totalTokens]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (totalTokens > 0) {
      setPresentHasValueCount(0);
      setCurrentPage(0);
      fetchData();
    }
  }, [query]);

  const checkInPriceTokenArray = (tokenName) => {
    return hasPriceNameArray.includes(tokenName.toLowerCase());
  };

  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom - 200 <= window.innerHeight;
  };

  const onScroll = useCallback((event) => {
    const wrappedElement = document.getElementById("__next");
    if (isBottom(wrappedElement)) {
      goto();
    }
  }, []);

  const loadString = (cnt) => {
    const el = document.getElementById("tokenList");
    document.getElementById("tokenList").innerText = "";
    let str = "";
    for (let i = 0; i < cnt; i++) {
      str =
        str +
        "<div class='mt-2  animate-pulse overflow-hidden rounded-xl mx-4 ' key={" +
        i +
        "}>" +
        "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
        "</div></div>";
    }
    el.innerHTML += str;
  };

  const unisatString = (token, i) => {
    let str =
      "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" +
      i +
      "}>" +
      "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
      "<div class='flex items-center justify-start md:min-w-[20%] min-w-[50%]'>" +
      '<a class="pl-2" href="#"><div class="font-bold">' +
      token.ticker +
      "</div></a></div>" +
      '<p class="md:min-w-[25%] min-w-[50%]"><b>$ 0.00</b></p>' +
      '<p class="text-green-500 md:min-w-[15%] md:block hidden"><b>0.00%</b></p>' +
      '<p class="md:min-w-[20%] md:block hidden"><b>$ 0.00</b></p><p class="md:min-w-[20%] md:block hidden"><b>$ 0.00</b></p>' +
      "</div></div>";
    return str;
  };

  const coinrankingString = (token, i) => {
    const price =
      token.price != (undefined || null)
        ? parseFloat(token.price).toFixed(3)
        : "0.00";
    const change =
      parseFloat(token.change) > 0 ? "text-green-500" : "text-red-500";
    const cap =
      token.marketCap != (undefined || null)
        ? parseInt(token.marketCap).toLocaleString()
        : "0.00";
    const vol =
      token["24hVolume"] != (undefined || null)
        ? parseInt(token["24hVolume"]).toLocaleString()
        : "0.00";
    const changeVal =
      token["change"] != (undefined || null)
        ? parseFloat(token["change"]).toLocaleString()
        : "0.00";
    let str =
      "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" +
      i +
      "}>" +
      "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
      "<div class='flex items-center justify-start md:min-w-[20%] min-w-[50%]'>" +
      '<img alt="logo" srcset="/_next/image?url=' +
      token.iconUrl +
      "&amp;w=32&amp;q=75 1x, /_next/image?url=" +
      token.iconUrl +
      '&amp;w=64&amp;q=75 2x" src="http://localhost:3000/_next/image?url=' +
      token.iconUrl +
      '&amp;w=64&amp;q=75" width="30" height="30" decoding="async" data-nimg="1" class="rounded-xl" style="color: transparent; width: 25px; height: 25px;"></img>' +
      '<a class="pl-2" href="/tokens/' +
      token.name +
      "?uuid=" +
      token.uuid +
      "&amp;name=" +
      token.name +
      "&amp;symbol=" +
      token.symbol +
      '"><div class="font-bold">' +
      token.name +
      "</div></a></div>" +
      "<p class='md:min-w-[25%] min-w-[50%]'><b>$" +
      price +
      "</b></p>" +
      "<p class='md:min-w-[15%] md:block hidden " +
      change +
      "'><b>" +
      changeVal +
      "%</b></p>" +
      "<p class='md:min-w-[20%] md:block hidden'>$" +
      cap +
      "</p>" +
      "<p class='md:min-w-[20%] md:block hidden'>$" +
      vol +
      "</p>" +
      "</div>" +
      "</div>";
    return str;
  };
  const manipulateUnistatData = (
    getTokensCnt,
    unisatData,
    currentPage,
    dir
  ) => {
    let data = [];
    let cnt = 0;
    if (dir === 0) {
      for (let i = 0; i < unisatData.length; i++) {
        if (!checkInPriceTokenArray(unisatData[i].ticker)) {
          cnt = cnt + 1;
          data.push(unisatData[i]);
          if (cnt === getTokensCnt) {
            currentPage = currentPage + 1;
            break;
          }
        }
        currentPage = currentPage + 1;
      }
    } else {
      if (getTokensCnt > 20) {
        for (let i = 0; i < unisatData.length; i++) {
          if (
            !checkInPriceTokenArray(
              unisatData[unisatData.length - i - 1].ticker
            )
          ) {
            cnt = cnt + 1;
            if (cnt > 20) data.push(unisatData[unisatData.length - i - 1]);
            if (cnt === getTokensCnt) {
              break;
            }
          }
          if (cnt <= 20) currentPage = currentPage - 1;
        }
      } else {
        for (let i = 0; i < unisatData.length; i++) {
          if (
            !checkInPriceTokenArray(
              unisatData[unisatData.length - i - 1].ticker
            )
          ) {
            cnt = cnt + 1;
            data.push(unisatData[unisatData.length - i - 1]);
            if (cnt === getTokensCnt) {
              currentPage = currentPage - 1;
              break;
            }
          }
          currentPage = currentPage - 1;
        }
      }
      data.reverse();
    }

    setCurrentPage(currentPage);

    return data;
  };
  const goto = (dir) => {
    let tokensPerPage = 20;
    let maxPageTokens = 35;
    const el = document.getElementById("tokenList");
    let addedComponent = "";

    let presentHasValueCountBuffer = presentHasValueCount;
    let currentPageBuffer = currentPage;
    if (dir === 1) {
      presentHasValueCountBuffer = 0;
      currentPageBuffer = 0;
    }
    if (dir === 4) {
      if (totalTokens <= tokensPerPage) return;
      presentHasValueCountBuffer =
        Math.ceil(totalTokens / tokensPerPage) * tokensPerPage;
      currentPageBuffer = totalTokens;
    }

    if (dir === 3 && presentHasValueCountBuffer >= totalTokens - 20) {
      return;
    } else if (dir === 2 && presentHasValueCountBuffer <= 20) {
      return;
    } else {
      document.getElementById("tokenList").innerText = "";
      if (dir === 0 || dir === 1 || dir === 3) {
        const nextPage = presentHasValueCountBuffer + 20;
        if (
          presentHasValueCountBuffer + tokensPerPage <=
          matchQueryValueCount
        ) {
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            presentHasValueCountBuffer,
            nextPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          el.innerHTML += addedComponent;
          setPresentHasValueCount(nextPage);
          setCurrentPage(0);
        } else if (presentHasValueCountBuffer >= matchQueryValueCount) {
          // // document.getElementById('spinner').style.displa
          loadString(10);
          axios
            .get(
              `https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=${currentPageBuffer}&limit=${maxPageTokens}&complete=&sort=deploy`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage,
                unisatData.data.data.detail,
                currentPageBuffer,
                0
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.ticker)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        } else {
          let remainTokensCnt =
            matchQueryValueCount - presentHasValueCountBuffer;
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            presentHasValueCountBuffer
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          loadString(10);
          // // document.getElementById('spinner').style.displa
          axios
            .get(
              `https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=${currentPageBuffer}&limit=${maxPageTokens}&complete=&sort=deploy`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage - remainTokensCnt,
                unisatData.data.data.detail,
                currentPageBuffer,
                0
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.ticker)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              //document.getElementById('spinner').style.display = 'none';
            });
        }
      } else {
        const nextPage = presentHasValueCountBuffer - 20;
        if (
          presentHasValueCountBuffer <=
          matchQueryValueCount + tokensPerPage
        ) {
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            nextPage - tokensPerPage,
            presentHasValueCountBuffer - tokensPerPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          el.innerHTML += addedComponent;
          setPresentHasValueCount(nextPage);
          setCurrentPage(0);
        } else if (
          presentHasValueCountBuffer >=
          matchQueryValueCount + tokensPerPage * 2
        ) {
          // document.getElementById('spinner').style.displa
          let start = currentPageBuffer - maxPageTokens - 20;
          if (start < 0) start = 0;
          loadString(10);
          axios
            .get(
              `https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=${start}&limit=${
                maxPageTokens + 20
              }&complete=&sort=deploy`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage * 2,
                unisatData.data.data.detail,
                currentPageBuffer,
                1
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.ticker)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        } else {
          let remainTokensCnt =
            matchQueryValueCount - presentHasValueCountBuffer + tokensPerPage;
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            nextPage - tokensPerPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          let start = currentPageBuffer - maxPageTokens;
          if (start < 0) start = 0;
          loadString(10);
          // document.getElementById('spinner').style.displa
          axios
            .get(
              `https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=${start}&limit=${maxPageTokens}&complete=&sort=deploy`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage - remainTokensCnt,
                unisatData.data.data.detail,
                currentPageBuffer,
                1
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.ticker)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        }
      }
    }
  };

  const goPage = (dir) => {
    goto(dir);
  };
  return (
    <Base>
      <section className="section table-body mt-3">
        <div className="sm:container">
          <p id="presentHasValueCount" hidden>
            0
          </p>
          <p id="matchQueryValueCount" hidden>
            0
          </p>
          <p id="currentPage" hidden>
            0
          </p>
          {ranking.stats.marketCapChange && (
            <p id="totalTokens" hidden>
              {unisat.total}
            </p>
          )}
          <p id="pageDir" hidden>
            0
          </p>
          <div className="mt-12 overflow-hidden rounded-3xl border border-solid border-gray-300 shadow-xl">
            <div className="flex flex-col px-6 lg:flex-row lg:px-12">
              <div className="flex flex-row lg:flex-none">
                <Link
                  href="http://bxdx.io/"
                  className="relative m-auto mt-8 h-[150px] w-[150px] md:h-[200px] md:w-[200px] "
                >
                  <ImageFallback
                    className="rounded-xl"
                    src="/images/tokens/AD.png"
                    alt="AD"
                    unoptimized={true}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Link>
                <Link
                  href="https://twitter.com/BRC20Today"
                  className="relative m-auto mt-8 block h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:hidden"
                >
                  <ImageFallback
                    className="rounded-xl"
                    src="/images/tokens/Today.gif"
                    unoptimized={true}
                    alt="logo"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Link>
              </div>

              <div className="mb-12 mt-16 w-full grow lg:mb-0">
                <h2 className="mb-10 text-center">BRC-20 Tokens</h2>
                <div className="mb-2 flex items-center">
                  <p className="flex w-[55%] justify-end text-lg font-extrabold dark:text-white sm:text-2xl">
                    Total Tokens: &nbsp;{" "}
                  </p>
                  <span
                    className="text-lg font-bold text-blue-600 sm:text-2xl"
                    id="total"
                    data-count="24677"
                  >
                    {ranking.stats.marketCapChange ? (
                      <AnimatedNumber
                        className=""
                        value={unisat.total}
                        startValue={0}
                        duration={3000}
                        generateCommas={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200">
                        <div className="animate-pluse rounded-lg p-4"></div>
                      </div>
                    )}
                  </span>
                </div>
                <div className="mb-2 flex items-center">
                  <p className="flex w-[55%] justify-end text-lg font-extrabold dark:text-white sm:text-2xl">
                    Market Cap: &nbsp;{" "}
                  </p>
                  <span
                    className="text-lg font-bold text-blue-600 sm:text-2xl"
                    id="cap"
                    data-count="475058296"
                  >
                    {ranking.stats.marketCap ? `$` : ""}
                    {ranking.stats.marketCap ? (
                      <AnimatedNumber
                        value={ranking.stats.marketCap}
                        startValue={0}
                        duration={3000}
                        generateCommas={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200">
                        <div className="animate-pluse rounded-lg p-4"></div>
                      </div>
                    )}
                  </span>
                </div>
                <div className="mb-2 flex items-center">
                  <p className="flex w-[55%] justify-end text-lg font-extrabold dark:text-white sm:text-2xl">
                    Trading Volume: &nbsp;
                  </p>
                  <span
                    className="text-lg font-bold text-blue-600 sm:text-2xl"
                    id="vol"
                    data-count="207583234"
                  >
                    {ranking.stats.volume ? "$" : ""}
                    {ranking.stats.volume ? (
                      <AnimatedNumber
                        value={ranking.stats.volume}
                        startValue={0}
                        duration={3000}
                        generateCommas={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-200">
                        <div className="animate-pluse rounded-lg p-4"></div>
                      </div>
                    )}
                  </span>
                </div>
                <hr />
              </div>

              <div className="hidden flex-none lg:block">
                <Link
                  href="https://twitter.com/BRC20Today"
                  className="relative m-auto mt-8 flex h-[100px] w-[100px] md:h-[200px] md:w-[200px]"
                >
                  <ImageFallback
                    className="rounded-xl"
                    src="/images/tokens/Today.gif"
                    unoptimized={true}
                    alt="logo"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Link>
              </div>
            </div>
            <div className="mb-6 w-full overflow-auto">
              <div className="md:min-w-[800px]">
                <div className="w-full overflow-hidden rounded-xl">
                  <div className="roundex-xl mx-4 mt-4 flex justify-between gap-3 px-4 py-4 transition-all duration-200 ease-linear">
                    <div className="min-w-[50%] font-bold md:min-w-[20%]">
                      Name
                    </div>
                    <div className="min-w-[50%] font-bold md:min-w-[25%]">
                      Price
                    </div>
                    <div className="hidden font-bold md:block md:min-w-[15%]">
                      24%
                    </div>
                    <div className="hidden font-bold md:block md:min-w-[20%]">
                      Market Cap
                    </div>
                    <div className="hidden font-bold md:block md:min-w-[20%]">
                      Volume(24h)
                    </div>
                  </div>
                  <div id="tokenList"></div>
                  <div className="mx-4 mt-2 flex justify-end gap-2">
                    <div
                      className="rounded-[10px] border border-solid px-[15px] pb-[5px] text-[32px] font-semibold hover:cursor-pointer hover:bg-blue-700 hover:text-white"
                      onClick={() => goPage(1)}
                    >
                      &laquo;
                    </div>
                    <div
                      className="rounded-[10px] border border-solid px-[15px] pt-[8px] text-[24px] font-semibold hover:cursor-pointer hover:bg-blue-700 hover:text-white"
                      onClick={() => goPage(2)}
                    >
                      &lt;
                    </div>
                    <div
                      className="rounded-[10px] border border-solid px-[15px] pt-[8px] text-[24px] font-semibold hover:cursor-pointer hover:bg-blue-700 hover:text-white"
                      onClick={() => goPage(3)}
                    >
                      &gt;
                    </div>
                    <div
                      className="rounded-[10px] border border-solid px-[15px] text-[32px] font-semibold hover:cursor-pointer hover:bg-blue-700 hover:text-white"
                      onClick={() => goPage(4)}
                    >
                      &raquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='w-10/12 m-auto flex items-center justify-center' id="spinner">
                <div role="status m-auto py-8">
                  <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div> */}

            {/* {(unisat.detail.length == 0 && loading == false) && <div className='w-full font-bold text-center p-4 hover:bg-[#dedcdc] dark:hover:bg-[#1f2168]'>No Data</div>} */}
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const homepage = await getListPage("content/_index.md");
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {},
  };
};
