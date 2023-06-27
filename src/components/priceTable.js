import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Image from 'next/image'

export default function PriceTable() {
  const [tokenLists, setTokenLists] = useState([])
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 20

  const endOffset = itemOffset + itemsPerPage

  const currentItems = tokenLists.slice(itemOffset, endOffset)

  const pageCount = Math.ceil(tokenLists.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % tokenLists.length
    setItemOffset(newOffset)
  }

  // const fetchData = async () => {
  //   const options = {
  //     headers: {
  //       'x-access-token': process.env.NEXT_PUBLIC_COINRANKING_ACCESS_TOKEN,
  //     },
  //   }
  //   const response = await fetch(
  //     `https://coinranking.com/api/v2/coins?offset=0&orderBy=marketCap&limit=50&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=&tags[]=ltc-20`,
  //     options
  //   )
  //   const result = await response.json()
  //   if (result.status === 'success') setTokenLists(result.data.coins)
  // }

  const fetchData = async () => {
    const options = {
      headers: {
        Apikey: process.env.NEXT_PUBLIC_API_KEY,
        Authentication: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    }
    const response = await fetch(
      `https://lqtikanonsrqxhlfwruz.supabase.co/rest/v1/ltc20_list?select=*&order=id.asc`,
      options
    )
    const result = await response.json()
    const tokenData = []
    result.map((data, index) => {
      const newData = {
        ...data,
        changes: getRandomInt(-5, 5),
      }
      tokenData.push(newData)
    })

    if (result) setTokenLists(tokenData)
  }

  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.random() * (max - min) + min
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='bg-white mt-5 rounded-md py-5 shadow-lg dark:bg-transparent'>
      <div className='flex md:gap-3 justify-between md:mx-4 px-4 py-2 transition-all ease-linear duration-200 roundex-xl border-b border-t dark:border-gray-600'>
        <div className='md:min-w-[5%] min-w-[15%] font-bold'>#</div>
        <div className='md:min-w-[20%] min-w-[55%] font-bold'>Name</div>
        <div className='md:min-w-[20%] min-w-[30%] font-bold'>Price</div>
        <div className='md:min-w-[15%] md:block hidden font-bold'>24%</div>
        <div className='md:min-w-[20%] md:block hidden font-bold'>
          Market Cap
        </div>
        <div className='md:min-w-[20%] md:block hidden font-bold'>
          Volume(24h)
        </div>
      </div>

      {currentItems.map((token, index) => {
        return (
          <div
            className='text-xs flex md:gap-3 justify-between items-center md:mx-4 px-4 py-4 transition-all ease-linear duration-200 roundex-xl border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600'
            key={index}
          >
            <div className='md:min-w-[5%] min-w-[15%] font-bold'>
              {itemOffset + index + 1}
            </div>
            <div className='md:min-w-[20%] min-w-[55%] font-bold flex items-center'>
              {/* <Image
                src={token.iconUrl}
                alt='token icon'
                width={30}
                height={30}
                className='rounded-full mr-3'
              /> */}
              <div>
                <p className=''>{token.ticker || '-'}</p>
                {/* <p className='text-gray-400'>{token.symbol}</p> */}
              </div>
            </div>
            <div className='md:min-w-[20%] min-w-[30%] font-bold'>
              $
              {token.price ||
                Number(getRandomInt(100, 1000).toFixed(2)).toLocaleString()}
            </div>
            <div className='md:min-w-[15%] md:block hidden font-bold'>
              {/* {token['24h'] < 0 ? (
                <span className='text-red-500'>{token['24h']}</span>
              ) : (
                <span className='text-green-500'>{token['24h']}</span>
              )} */}

              {token.changes < 0 ? (
                <span className='text-red-500'>
                  {token.changes.toFixed(2)}%
                </span>
              ) : (
                <span className='text-green-500'>
                  {token.changes.toFixed(2)}%
                </span>
              )}
            </div>
            <div className='md:min-w-[20%] md:block hidden font-bold'>
              $
              {token.marketCap ||
                Number(
                  getRandomInt(100000, 10000000).toFixed(2)
                ).toLocaleString()}
            </div>
            <div className='md:min-w-[20%] md:block hidden font-bold'>
              $
              {token['volumn'] ||
                Number(getRandomInt(1000, 10000).toFixed(2)).toLocaleString()}
            </div>
          </div>
        )
      })}

      <ReactPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        previousLabel='<'
        renderOnZeroPageCount={null}
        className='pagination'
      />
    </div>
  )
}
