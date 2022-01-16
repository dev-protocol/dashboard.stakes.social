import { createContext } from 'react'
import { ChainName } from 'src/fixtures/wallet/utility'

export const settings = {
  isCurrencyDEV: true,
  toggleCurrency: () => {},
  selectedChain: 'ethereum' as ChainName,
  setChain: (_: ChainName) => {}
}

const SettingContext = createContext(settings)

export default SettingContext
