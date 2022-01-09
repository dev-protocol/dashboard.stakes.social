import { providers } from 'ethers'
import { detectChain } from './utility'

jest.mock('web3')
jest.mock('ethers')

describe('wallet utility', () => {
  describe('detectChain', () => {
    test('Returns undefined when the detected chainId is not supported', async () => {
      const mock = { getNetwork: () => Promise.resolve({ chainId: 99999 }) } as unknown as providers.BaseProvider
      const result = await detectChain(mock)
      expect(result.chainId).toBe(99999)
      expect(result.name).toBe(undefined)
    })
    test('Detect mainnet', async () => {
      const mock = { getNetwork: () => Promise.resolve({ chainId: 1 }) } as unknown as providers.BaseProvider
      const result = await detectChain(mock)
      expect(result.chainId).toBe(1)
      expect(result.name).toBe('ethereum')
    })
    test('Detect ropsten', async () => {
      const mock = { getNetwork: () => Promise.resolve({ chainId: 3 }) } as unknown as providers.BaseProvider
      const result = await detectChain(mock)
      expect(result.chainId).toBe(3)
      expect(result.name).toBe('ropsten')
    })
    test('Detect arbitrum one', async () => {
      const mock = { getNetwork: () => Promise.resolve({ chainId: 42161 }) } as unknown as providers.BaseProvider
      const result = await detectChain(mock)
      expect(result.chainId).toBe(42161)
      expect(result.name).toBe('arbitrum-one')
    })
    test('Detect arbitrum rinkeby', async () => {
      const mock = { getNetwork: () => Promise.resolve({ chainId: 421611 }) } as unknown as providers.BaseProvider
      const result = await detectChain(mock)
      expect(result.chainId).toBe(421611)
      expect(result.name).toBe('arbitrum-rinkeby')
    })
  })
})
