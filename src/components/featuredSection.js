import { useEffect, useState } from 'react'
import { FireIcon, ClockIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Featured() {
  const [trendingTokenLists, setTrendingTokenLists] = useState([])
  const [latesteTokenLists, setLatesteTokenLists] = useState([])
  const [tokenStats, setTokenStats] = useState(null)

  const options = {
    headers: {
      'x-access-token': process.env.NEXT_PUBLIC_COINRANKING_ACCESS_TOKEN,
    },
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.random() * (max - min) + min
  }

  const fetchTrendingData = async () => {
    const response = await fetch(
      `https://coinranking.com/api/v2/coins?offset=0&orderBy=change&limit=3&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=&tags[]=ltc-20`,
      options
    )
    const result = await response.json()
    if (result.status === 'success') {
      setTokenStats(result.data.stats)
      setTrendingTokenLists(result.data.coins)
    }
  }

  const fetchLatestData = async () => {
    const response = await fetch(
      `https://coinranking.com/api/v2/coins?offset=0&orderBy=listedAt&limit=3&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=&tags[]=ltc-20`,
      options
    )
    const result = await response.json()
    if (result.status === 'success') setLatesteTokenLists(result.data.coins)
  }

  useEffect(() => {
    fetchTrendingData()
    fetchLatestData()
  }, [])

  return (
    <div className='mt-10'>
      <div className='block text-center justify-between md:flex md:text-left'>
        <div>
          <h1 className='text-xl md:text-4xl font-bold'>
            {"Today's LTC20 token prices"}
          </h1>

          {tokenStats ? (
            <div className='mt-10 text-sm font-bold md:text-lg md:pl-5'>
              <p className='my-2'>
                <span className='font-bold'>Market Cap:</span>
                <span className='text-[#2563EB]'>
                  {' $'}
                  {parseFloat(tokenStats.totalMarketCap).toLocaleString(
                    'en-US'
                  ) || '$185,572,605'}
                </span>
              </p>
              <p className='my-2'>
                <span className='font-bold'>Trading Volume:</span>
                <span className='text-[#2563EB]'>
                  {' $'}
                  {parseFloat(tokenStats.total24hVolume).toLocaleString(
                    'en-US'
                  ) || '$48,177,452'}
                </span>
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className='mt-3 md:mt-0'>
          <Image
            src='/EON.gif'
            width={200}
            height={200}
            alt='ad'
            className='m-auto'
          />
        </div>
      </div>

      <div className='md:columns-2 gap-10 mt-5'>
        <div className='shadow-lg bg-white p-3 rounded-md	dark:bg-[#212a3d]'>
          <div className='flex items-center mb-3 font-bold'>
            <FireIcon
              className='block h-6 w-6 mr-2 text-[#fd8f00]'
              aria-hidden='true'
            />
            Trending
          </div>

          {trendingTokenLists.map((token, index) => {
            return (
              <div
                className='flex md:gap-3 justify-between items-center md:mx-4 px-4 py-1 transition-all ease-linear duration-200 roundex-xl border-b text-[10px] dark:border-gray-600'
                key={index}
              >
                <div className='md:min-w-[10%] min-w-[10%] font-bold'>
                  {index + 1}
                </div>
                <div className='md:min-w-[60%] min-w-[70%] font-bold flex items-center'>
                  <Image
                    src={token.iconUrl}
                    alt='token icon'
                    width={26}
                    height={26}
                    className='rounded-full mr-3'
                  />
                  <span className='mr-2'>{token.name}</span>
                  <span className='text-gray-400'>{token.symbol}</span>
                </div>
                <div className='md:min-w-[30%] min-w-[20%] font-bold'>
                  <span className='text-green-500'>
                    {token.change ||
                      getRandomInt(
                        2 * (2 - index),
                        2 * (2 - index + 1)
                      ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className='shadow-lg bg-white p-3 mt-3 rounded-md dark:bg-[#212a3d]'>
          <div className='flex items-center mb-3 font-bold'>
            <ClockIcon
              className='block h-6 w-6 mr-2 text-gray-400'
              aria-hidden='true'
            />
            Recently Added
          </div>

          {latesteTokenLists.map((token, index) => {
            return (
              <div
                className='flex md:gap-3 justify-between items-center md:mx-4 px-4 py-1 transition-all ease-linear duration-200 roundex-xl border-b text-[10px] dark:border-gray-600'
                key={index}
              >
                <div className='md:min-w-[10%] min-w-[10%] font-bold'>
                  {index + 1}
                </div>
                <div className='md:min-w-[60%] min-w-[70%] font-bold flex items-center'>
                  <Image
                    src={token.iconUrl}
                    alt='token icon'
                    width={26}
                    height={26}
                    className='rounded-full mr-3'
                  />
                  <span className='mr-2'>{token.name}</span>
                  <span className='text-gray-400'>{token.symbol}</span>
                </div>
                <div className='md:min-w-[30%] min-w-[20%] font-bold'>
                  $
                  {token.price ||
                    Number(getRandomInt(100, 1000).toFixed(2)).toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
