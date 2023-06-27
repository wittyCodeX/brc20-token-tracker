import Header from '@layouts/partials/Header'
import Footer from '@layouts/partials/Footer'
import Base from "@layouts/Baseof";
import AnimatedNumber from "@layouts/components/AnimateNumber";
import { dexTVLData } from 'content/table';
import { useRouter } from "next/router";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import React, { useEffect, useState } from "react";
import ImageFallback from '@layouts/components/ImageFallback';
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import axios from 'axios';

const TokenPage = () => {

    const router = useRouter();
    // const data = router.query;
    const [tokenData, setTokenData] = useState({})
    const [marketData, setMarketData] = useState({})

    useEffect(() => {
        const data = router.query;
        if (data.uuid != undefined) {
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
                axios.get(`https://api.coinranking.com/v2/coin/${data.uuid}`, option).then((coindata) => {
                    setTokenData(coindata.data.data.coin)
                    axios.get(`https://coinranking.com/api/v2/coin/${data.uuid}/markets`, options).then((market) => {
                        setMarketData(market.data.data)
                    })
                });
            }
            fetchData();
        }
    }, [])

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

    return (
        <Base>
            <section className="section mt-16 overflow-hidden">
                <div className="sm:container">
                    <div className="p-6 border border-gray-300 border-solid rounded-3xl w-12/12 xl:w-11/12 m-auto shadow-xl">
                        <h2 className="text-center p-5 mb-5 text-4xl">{tokenData.name}</h2>
                        <hr />
                        {tokenData.iconUrl ? <div className='flex-col md:flex-row flex items-center mt-6'>
                            <div className='flex items-center'>
                                <ImageFallback className='rounded-xl' src={tokenData.iconUrl} priority alt='logo' style={{ width: '50px', height: '50px' }} width='60' height='60' />
                                <h4 className='font-bold mx-3'>{tokenData.name}</h4>
                                <div>{tokenData.symbol}</div>
                                <div className='border text-sm ml-3 px-1 py-[0.5] rounded-md'>#{tokenData.rank}</div>
                            </div>
                            <div className='flex items-center'>
                                <div className='font-extrabold font-2xl ml-12'>${tokenData.price}</div>
                                <div className='border text-sm ml-3 px-1 py-[0.5] rounded-md'>live</div>
                            </div>
                        </div> : loading()}
                        <div className='flex'>
                            <div className='border my-8 w-full rounded-xl'>
                                {tokenData.sparkline != null ? <ResponsiveContainer width='100%' height={200}>
                                    <AreaChart
                                        width={500}
                                        height={200}
                                        data={tokenData.sparkline.map((val, index) => ({ 'time': `${index}h`, value: val }))}
                                        margin={{
                                            top: 0,
                                            right: 5,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis
                                            dataKey='time'
                                            tick={{ fill: 'red' }}
                                            tickLine={{ stroke: 'white' }}
                                        />
                                        <YAxis
                                            dataKey='value'
                                            orientation='right'
                                            tick={{ fill: 'red' }}
                                            tickLine={{ stroke: 'white' }}
                                        />
                                        <Tooltip />
                                        <Area type='monotone' dataKey='value' stroke='#279778' fill='#e5e5e5' />
                                    </AreaChart>
                                </ResponsiveContainer> :
                                    <div style={{ width: '100%', height: '200px' }} className='text-center items-center flex justify-center font-extrabold'>
                                        --
                                    </div>
                                }
                            </div>

                        </div>

                        {tokenData.supply != undefined && <><div className='border rounded-xl p-3 sm:p-5 flex'>
                            <div className='p-5 w-3/12 text-center hidden md:block '>
                                <h6 className='mb-4'>Total Supply</h6>
                                <p className='font-bold text-blue-500 dark:text-blue-500 text-base md:text-xl'>
                                    <AnimatedNumber value={tokenData.supply.total != null ? (parseInt(tokenData.supply.total)) : '--'} startValue={0} duration={3000} generateCommas={false} generateDecimals={false} />
                                </p>
                                <p className='text-blue-500'><b></b></p>
                            </div>
                            <div className='border hidden md:block'></div>
                            <div className='p-5 w-3/12 text-center hidden md:block'>
                                <h6 className='mb-4'>Market Cap</h6>
                                <p className='font-bold text-green-500 dark:text-green-500 text-base md:text-xl'>
                                    $<AnimatedNumber value={Number((tokenData.marketCap))} startValue={0} duration={3000} generateCommas={false} generateDecimals={false} />
                                </p>
                                <p className='text-green-500'><b></b></p>
                            </div>
                            <div className='border hidden md:block'></div>
                            <div className='py-3 sm:p-5 w-6/12 md:w-3/12 text-center'>
                                <h6 className='mb-4'>Price</h6>
                                <p className='font-bold text-blue-500 dark:text-blue-500  text-base md:text-xl'>
                                    $<AnimatedNumber value={tokenData.price != null ? ((tokenData.price)) : '--'} startValue={0} duration={3000} generateCommas={false} generateDecimals={true} count={6} />
                                </p>
                            </div>
                            <div className='border'></div>
                            <div className='py-3 sm:p-5 w-6/12 md:w-3/12 text-center'>
                                <h6 className='mb-4'>Highest Price</h6>
                                <p className='font-bold text-green-500 dark:text-green-500 text-base md:text-xl'>
                                    $<AnimatedNumber value={tokenData.allTimeHigh.price != null ? tokenData.allTimeHigh.price : '--'} startValue={0} duration={3000} generateCommas={false} generateDecimals={true} count={6} />
                                </p>
                            </div>
                        </div>

                            <h4 className='mt-8 text-4xl text-center'>Market Information</h4>
                            <p className=' mb-4 text-center'>View the Market data available of {tokenData.name}, including details on the market.</p>
                            <hr />
                            <div className='my-4 flex flex-col md:flex-row items-center'>
                                <div className='flex items-center justify-start mb-4'>
                                    <h5 className='text-blue-400 font-bold mx-3'> Total </h5>
                                    {marketData.stats && <h5 className='text-gray-700'>{marketData.stats.total}</h5>}
                                </div>
                                <div className='flex items-center justify-start mb-4'>
                                    <h5 className='text-blue-400 font-bold md:ml-8 mr-3'> 24h trade volume </h5>
                                    {marketData.stats && <h5 className='text-gray-700'>${(Number(marketData.stats['24hVolume']).toFixed(5))}</h5>}
                                </div>
                            </div>
                            <div className='w-full overflow-auto'>
                                <div className='overflow-hidden rounded-xl w-full'>
                                    <div class='flex items-center justify-between min-w-[100%] gap-3 py-4 transition-all ease-linear duration-200 roundex-xl'>
                                        <div className='md:min-w-[10%] min-w-[12%] font-bold'>ID</div>
                                        <div className='md:min-w-[30%] min-w-[50%] font-bold'>Markets</div>
                                        <div className='md:min-w-[20%] min-w-[38%] font-bold'>{tokenData.symbol} price</div>
                                        <div className='md:min-w-[20%] md:block hidden font-bold'>24h trade volume</div>
                                        <div className='md:min-w-[20%] md:block hidden font-bold'>Recommended</div>
                                    </div>

                                    {
                                        marketData.markets && marketData.markets.map((market, index) => {
                                            return (

                                                <div key={index} class='flex items-center justify-between min-w-[100%] gap-3 py-4 transition-all ease-linear duration-200 roundex-xl border-b'>
                                                    <div className='md:min-w-[10%] min-w-[12%] font-bold'>{index + 1}</div>
                                                    <div className='md:min-w-[30%] min-w-[50%] font-bold flex items-center'>
                                                        {market.exchange && <ImageFallback className='rounded-xl' src={market.exchange.iconUrl} priority alt='logo' style={{ width: '35px', height: '35px' }} width='60' height='60' />}
                                                        {market.base && <div className='ml-4'>
                                                            <div className='font-bold'>{market.base.symbol}/{market.quote.symbol}</div>
                                                            <div className=''>{market.exchange.name}</div>
                                                        </div>}</div>
                                                    <div className='md:min-w-[20%] min-w-[38%]'>${parseFloat(market.price).toFixed(3)}</div>
                                                    <div className='md:min-w-[20%] md:block hidden font-bold'>${market['24hVolume']}</div>
                                                    <div className='md:min-w-[20%] md:block hidden font-bold'>{market.recommended ? <IoShieldCheckmarkOutline className='text-green-400 text-2xl m-auto lg:m-0' /> : <IoShieldOutline className='text-2xl m-auto lg:m-0' />}</div>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </section>
        </Base>
    )
}

export default TokenPage;

export async function getServerSideProps(context) {
    const { params } = context;
    return {
        props: { data: 'data' },
    };
}
// export async function getStaticProps({ params }) {

//     const option = {
//         headers: {
//             'x-access-token': process.env.COINRAKING_API_KEY
//         },
//         params: {
//             tags: ['brc-20'],
//             limit: 200,
//         }
//     }
//     const result = await axios.get('https://api.coinranking.com/v2/coins', option)
//     const token =
// }

// export async function getStaticPaths() {
//     // When this is true (in preview environments) don't
//     // prerender any static pages
//     // (faster builds, but slower initial page load)
//     if (process.env.SKIP_BUILD_STATIC_GENERATION) {
//         return {
//             paths: [],
//             fallback: 'blocking',
//         }
//     }
//     const option = {
//         headers: {
//             'x-access-token': process.env.COINRAKING_API_KEY
//         },
//         params: {
//             tags: ['brc-20'],
//             limit: 200,
//         }
//     }
//     // Call an external API endpoint to get posts
//     const res = await axios.get('https://api.coinranking.com/v2/coins', option)
//     const tokens = await res.json()

//     // Get the paths we want to prerender based on posts
//     // In production environments, prerender all pages
//     // (slower builds, but faster initial page load)
//     const paths = tokens.map((token) => ({
//         params: { token: token.name + '?uuid=' + token.uuid + '&amp;name=' + token.name + '&amp;symbol=' + token.symbol },
//     }))

//     // { fallback: false } means other routes should 404
//     return { paths, fallback: false }
// }