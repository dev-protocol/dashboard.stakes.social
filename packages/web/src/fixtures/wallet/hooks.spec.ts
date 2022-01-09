import { renderHook } from '@testing-library/react-hooks'
import { useDetectChain } from './hooks'
import { detectChain } from 'src/fixtures/wallet/utility'

jest.mock('src/fixtures/wallet/utility.ts')

// TODO: Test it!
describe.skip('useDetectChain', () => {
  test('Returns the response of detectChain', async () => {
    ;(detectChain as jest.Mock).mockImplementation(() => Promise.resolve({ chainId: 9999, name: 'test' }))
    const { result, waitForNextUpdate } = renderHook(() => useDetectChain({} as any))
    await waitForNextUpdate()
    expect(result.current.chainId).toBe(9999)
    expect(result.current.name).toBe('test')
  })
})
