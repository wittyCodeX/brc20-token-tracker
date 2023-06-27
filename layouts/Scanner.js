import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
const Scanner = () => {

  const [address, setAddress] = useState('');
  const [result, setResult] = useState([]);
  const [money, setMoney] = useState({});
  const [tokenData, setTokenData] = useState({});
  const [loading, setLoading] = useState(0)
  const [tableLoading, setTableLoading] = useState(0)
  const [page, setPage] = useState(1)
  const [presentToken, setPresentToken] = useState('')
  useEffect(() => {
    // myInput.current.value = 1;
  }, []);

  const scan = async () => {
    if (address) {
      setLoading(1)
      const mempool = await axios.get(`https://mempool.space/api/address/${address}`)
      const token = await axios({
        method: 'get',
        url: `https://unisat.io/brc20-api-v2/address/${address}/brc20/summary?start=0&limit=100`,
      })
      let tokenHistory;
      if (token.data.data.detail.length) tokenHistory = await axios.get(`https://unisat.io/brc20-api-v2/address/${address}/brc20/${token.data.data.detail[0].ticker}/history?start=0&limit=20`)
      else tokenHistory = { data: { data: { detail: [], total: 0 } } };
      if (token.data.data.detail.length) setPresentToken(token.data.data.detail[0].ticker)
      else setPresentToken('')
      setTokenData(tokenHistory.data.data)
      setMoney(mempool.data)
      setResult(token.data.data.detail)
      setLoading(2)
      setTableLoading(2)
    }
  }

  const getTokenHistory = async (tokenTicker, start, presentPage) => {
    setTableLoading(1)
    setPresentToken(tokenTicker)
    const tokenHistory = await axios.get(`https://unisat.io/brc20-api-v2/address/${address}/brc20/${tokenTicker}/history?start=${start}&limit=20`)
    setPage(presentPage);
    setTokenData(tokenHistory.data.data)
    setTableLoading(2)
  }

  const truncateAddress = (address) => {
    return address.slice(0, 10) + '...' + address.substr(address.length - 10)
  }

  const priceToBTC = (price) => {
    return parseFloat(price / (100000000)) + ' BTC'
  }

  const convertCurrency = (labelValue) => {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
      : Math.abs(Number(labelValue)) >= 1.0e6
        ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
        : Math.abs(Number(labelValue)) >= 1.0e3
          ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
          : Math.abs(Number(labelValue))
  }
  const goto = (p) => {
    const totalPage = parseInt(tokenData.total / 20) + 1
    if (p > totalPage || p < 1) window.alert('Incorrect page');
    else {
      setPage(p)
      getTokenHistory(presentToken, (p - 1) * 20, p)
    }
  }

  const spinner = () => (
    <div className='w-10/12 m-auto h-[400px]  flex items-center justify-center'>
      <div role="status m-auto py-8">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <section className="section mt-16">
      <div className="container">
        <div className="p-6 border border-gray-300 border-solid rounded-3xl m-auto shadow-xl w-full">
          <h2 className="text-center p-5 mb-5">Check your BRC-20 balance</h2>
          <hr />
          <div className="p-5 mt-5 mb-5 w-full m-auto flex justify-center">
            <input className="border w-8/12 p-3 rounded-l-2xl" placeholder="Address" required onChange={(e) => setAddress(e.target.value)} />
            <button className="bg-[#2ba283] rounded-r-2xl py-3 text-xs sm:text-base px-6 sm:px-8 text-white font-bold hover:bg-[#0e654f]" onClick={() => scan()}>Scan</button>
          </div>
          {loading == 2 && <div className='row flex'>
            <hr />
            <h3 className='text-center mt-5'>Account Info</h3>
            <div className='py-2 w-full md:w-10/12 lg:w-8/12 m-auto sm:flex sm:justify-between sm:items-center'>
              <h6 className='flex mr-3'>ADDRESS: </h6>
              <div>{truncateAddress(money.address)}</div>
            </div>
            <div className='py-2 w-full md:w-10/12 lg:w-8/12 m-auto sm:flex sm:justify-between sm:items-center'>
              <h6 className='flex mr-3'>BALANCE: </h6>
              <div>{priceToBTC(money.chain_stats.funded_txo_sum - money.chain_stats.spent_txo_sum)}</div>
            </div>
            <div className='py-2 w-full md:w-10/12 lg:w-8/12 m-auto sm:flex sm:justify-between sm:items-center'>
              <h6 className='flex mr-3'>CONFIRMED TX COUNT: </h6>
              <div>{money.chain_stats.tx_count}</div>
            </div>
            <div className='py-2 w-full md:w-10/12 lg:w-8/12 m-auto sm:flex sm:justify-between sm:items-center'>
              <h6 className='flex mr-3'>CONFIRMED RECEIVED: </h6>
              <div>{money.chain_stats.funded_txo_count} outputs {'('}{priceToBTC(money.chain_stats.funded_txo_sum)}{')'}</div>
            </div>
            <div className='py-2 w-full md:w-10/12 lg:w-8/12 m-auto sm:flex sm:justify-between sm:items-center'>
              <h6 className='flex mr-3'>CONFIRMED TX COUNT: </h6>
              <div>{money.chain_stats.spent_txo_count} outputs {'('}{priceToBTC(money.chain_stats.spent_txo_sum)}{')'}</div>
            </div>
            <hr />
          </div>}
          <div>
            {loading == 2 && <>
              <h3 className="mt-5 mb-3 text-18 font-bold text-textPrimary text-center">BRC-20 Balances</h3>
              <div className="flex flex-wrap">
                {
                  result.map((token, i) => (
                    <div className="flex flex-col  w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                      <div className='rounded-xl bg-[#ebe8e8] dark:bg-[#362459] p-3 m-2 hover:cursor-pointer hover:bg-[#c4c2c2] dark:hover:bg-[#4c3183]' onClick={() => getTokenHistory(token.ticker, page * 20, 1)}>
                        <h6 className="text-12 font-medium mb-3 text-textSecondary">{token.ticker}</h6>
                        <div className='flex justify-between'>
                          <p>Transferable</p>
                          <p>{convertCurrency(token.transferableBalance)}</p>
                        </div>
                        <div className='flex justify-between'>
                          <p>Available</p>
                          <p>{convertCurrency(token.availableBalance)}</p>
                        </div>
                        <div className='flex justify-between border-t border-gray-500 dark:border-t-white'>
                          <p>Balance</p>
                          <p>{convertCurrency(token.overallBalance)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
                {result.length == 0 && <div className='text-center'>No BRC-20 Tokens</div>}
              </div>
            </>}
            {loading == 2 && tableLoading == 2 && <>
              <h3 className="mt-5 mb-3 text-18 font-bold text-textPrimary text-center">{presentToken} Token Activity</h3>
              <div className="h-full overflow-hidden rounded-xl bg-bgSecondary transition-transform relative overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#ebe8e8] dark:bg-[#362459]">
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">Inscription</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">Token</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">Action</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">Amount</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">From</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">To</th>
                      <th className="px-4 py-[14px] text-left text-14 font-medium text-textTertiary">Date</th>
                    </tr>
                  </thead>
                  <tbody className="relative">
                    {
                      tokenData.detail.map((history, i) => (
                        <tr className='border-b hover:cursor-pointer hover:bg-[#f9f3f3] dark:hover:bg-[#362459]'>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">
                            <a className="" href={"https://ordiscan.com/inscription/" + history.inscriptionNumber}>#{history.inscriptionNumber}</a>
                          </td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">{history.ticker}</td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">
                            {history.type == 'inscribe-mint' ? <div className="-my-2 inline-flex items-center rounded-lg px-3 py-2 text-12 font-semibold bg-[#8bf875] text-[#2ba283]">Mint</div> :
                              history.type == 'inscribe-deploy' ? <div className="-my-2 inline-flex items-center rounded-lg px-3 py-2 text-12 font-semibold bg-[#75b4f8] text-[#2b5ea2]">Deploy</div> :
                                <div className="-my-2 inline-flex items-center rounded-lg px-3 py-2 text-12 font-semibold bg-[#f2acac] text-[#ff3737]">Send</div>}
                          </td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">
                            {history.type == "inscribe-mint" ? <p className="text-[#2ba283]">+{history.amount}</p> : history.type == "inscribe-deploy" ? <p className="text-[#2b5ba2]">+{history.amount}</p> : <p className="text-[#ff3737]">-{history.amount}</p>}
                          </td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">
                            <a className="" href={"https://ordiscan.com/address/" + history?.from + "/brc20"}>{truncateAddress(history?.from)}</a>
                          </td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">
                            <a className="" href={"https://ordiscan.com/address/" + history?.to + "/brc20"}>{truncateAddress(history?.to)}</a>
                          </td>
                          <td className="whitespace-nowrap border-t border-t-divider px-4 py-4 text-left text-14 font-medium text-textPrimary">{formatter.format(new Date(history.blocktime * 1000))}</td>
                        </tr>
                      ))
                    }

                  </tbody>
                </table>
                {tokenData.detail.length == 0 && <div className='border-b hover:cursor-pointer hover:bg-[#f9f3f3] dark:hover:bg-[#362459] text-center py-3'>No Token History</div>}
              </div>
              <div className=" px-4 py-3 sm:px-6">
                <div className="flex justify-center items-center">
                  <input type='button' className={`relative btn btn-primary hover:bg-[#178f6f] inline-flex items-center rounded-md border px-4 py-2 text-sm font-mediumhover:cursor-pointer`} onClick={() => goto(page - 1)} value="<" />
                  <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:cursor-pointer hover:bg-gray-50 mx-2">  {page} / {(parseInt(tokenData.total / 20) + 1)}</button>
                  <input type='button' className={`relative btn btn-primary hover:bg-[#178f6f] inline-flex items-center rounded-md border px-4 py-2 text-sm font-mediumhover:cursor-pointer`} onClick={() => goto(page + 1)} value=">" />
                </div>
              </div>
            </>}

            {loading == 1 && spinner()}
            {tableLoading == 1 && spinner()}<div className=''>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;