import { ChainName, detectChain } from './utility'
import { useContext, useEffect, useMemo, useState } from 'react'
import WalletContext from 'src/context/walletContext'
import SettingContext from 'src/context/settingContext'
import { WEB3_PROVIDER_ENDPOINT_KEY, WEB3_PROVIDER_ENDPOINT_HOSTS } from 'src/fixtures/wallet/constants'
import { providers } from 'ethers'
import { whenDefined } from '@devprotocol/util-ts'

const providerUrl = (chain: ChainName) =>
  chain
    ? `${
        chain === 'ethereum'
          ? WEB3_PROVIDER_ENDPOINT_HOSTS.MAIN
          : chain === 'ropsten'
          ? WEB3_PROVIDER_ENDPOINT_HOSTS.ROPSTEN
          : chain === 'arbitrum-one'
          ? WEB3_PROVIDER_ENDPOINT_HOSTS.ARB_ONE
          : chain === 'arbitrum-rinkeby'
          ? WEB3_PROVIDER_ENDPOINT_HOSTS.ARB_RINKEBY
          : WEB3_PROVIDER_ENDPOINT_HOSTS.MAIN
      }/${WEB3_PROVIDER_ENDPOINT_KEY}`
    : undefined
const nonConnectedEthersProvider = (chain: ChainName) =>
  whenDefined(providerUrl(chain), url => new providers.JsonRpcProvider(url))
const nonConnectedEthersL1Provider = new providers.JsonRpcProvider(providerUrl('ethereum'))

export const useProvider = () => {
  const { ethersProvider } = useContext(WalletContext)
  const { selectedChain: requestedChain } = useContext(SettingContext)
  const ncEthersProvider = useMemo(() => nonConnectedEthersProvider(requestedChain ?? 'ethereum'), [requestedChain])
  return {
    ethersProvider,
    nonConnectedEthersProvider: ncEthersProvider,
    nonConnectedEthersL1Provider
  }
}

export const useDetectChain = (ethersProvider?: providers.BaseProvider) => {
  const [chain, setChain] = useState<undefined | { chainId?: number; name?: ChainName }>()
  useEffect(() => {
    detectChain(ethersProvider).then(setChain)
  }, [ethersProvider])
  return { chainId: chain?.chainId, name: chain?.name }
}

export const useIsL1 = () => {
  const { nonConnectedEthersProvider } = useProvider()
  const { name: chain } = useDetectChain(nonConnectedEthersProvider)
  const isL1 = useMemo(() => whenDefined(chain, c => c === 'ethereum'), [chain])
  return { isL1 }
}
