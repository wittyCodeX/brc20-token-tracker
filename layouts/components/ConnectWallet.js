import config from "@config/config.json";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from 'next/image'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const ConnectWallet = () => {
  const wallet = useSelector(state => state.wallet);
  const dispatch = useDispatch()

  const [network, setNetwork] = useState('livenet')
  const [walletModalShow, setWalletModalShow] = useState(false)

  const truncateAddress = (address) => {
    return address.slice(0, 5) + '...' + address.substr(address.length - 3)
  }
  const handleAccountsChanged = (_accounts) => {
    if (_accounts.length > 0) {
      dispatch({ type: 'ADDRESS', payload: _accounts[0] })

      getBasicInfo()
    } else {
      dispatch({ type: 'DISCONNECT' })
    }
  }

  const getBasicInfo = async () => {
    const [address] = await unisat.getAccounts()
    dispatch({ type: 'ADDRESS', payload: address })

    const balance = await unisat.getBalance()
    dispatch({ type: 'BALANCE', payload: balance.total })

    const network = await unisat.getNetwork()
    setNetwork(network)
  }

  const handleNetworkChanged = (network) => {
    setNetwork(network)
    getBasicInfo()
  }

  const connectWallet = async () => {
    if (window.unisat) {
      try {
        const unisat = window.unisat
        const accounts = await unisat.getAccounts()
        handleAccountsChanged(accounts)

        const result = await unisat.requestAccounts()
        handleAccountsChanged(result)

        unisat.on('accountsChanged', handleAccountsChanged)
        unisat.on('networkChanged', handleNetworkChanged)
        setWalletModalShow(false)

        return () => {
          unisat.removeListener('accountsChanged', handleAccountsChanged)
          unisat.removeListener('networkChanged', handleNetworkChanged)
        }
      } catch (error) {
        alert(error.message)
      }
    } else {
      return false
    }
  }

  return (
    <>
      {
        wallet.isConnected ? (
          <>
            <button className="btn btn-primary hidden md:block">
              {truncateAddress(wallet.address)}
            </button>
            <button className="btn btn-outline-primary block md:hidden" style={{ paddingTop: '4px', paddingLeft: '4px', paddingRight: '4px' }}>
              <Image src='/images/unisat.png' alt='wallet icon' width={30} height={20} className='wallet-icon mx-2' />
            </button>
          </>
        ) : <>
          <button
            type="button"
            className="btn btn-primary text-xs sm:text-base hidden md:block"
            onClick={() => setWalletModalShow(true)
            }
          >
            Connect
          </button>
          <button
            type="button"
            className="btn btn-outline-primary block md:hidden"
            style={{ paddingTop: '4px', paddingLeft: '4px', paddingRight: '4px' }}
            onClick={() => setWalletModalShow(true)
            }
          >
            <Image src='/images/unisat.png' alt='wallet icon' width={30} height={20} className='wallet-icon mx-2' style={{ filter: 'grayscale(100%' }} />
          </button>
        </>
      }
      <Modal open={walletModalShow} onClose={() => setWalletModalShow(false)} classNames={{ modal: 'rounded-xl' }}>
        <div className='text-black' style={{ width: '300px' }}>
          <h3 className='text-center mb-4 dark:text-black'>Select Wallet</h3>
          <div className='hover:cursor-pointer hover:bg-slate-200 p-4 rounded-xl'>
            <div
              className='wallet-item flex items-center'
              onClick={() => connectWallet()}
            >
              <Image
                src='/images/unisat.png'
                alt='wallet icon'
                width={30}
                height={30}
                className='wallet-icon mx-2'
              />
              <h4 className="font-bolder pl-4">Unisat Wallet</h4>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConnectWallet;
