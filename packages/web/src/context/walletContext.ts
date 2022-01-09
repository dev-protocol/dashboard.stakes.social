import Web3 from 'web3'
import { createContext } from 'react'
import { ethers } from 'ethers'

interface IWallet {
  web3?: Web3
  ethersProvider?: ethers.providers.BaseProvider
  setProviders: Function
}

export const wallet: IWallet = {
  web3: undefined,
  ethersProvider: undefined,
  setProviders: () => {}
}

const WalletContext = createContext(wallet)

export default WalletContext
