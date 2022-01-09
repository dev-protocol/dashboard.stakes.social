import { Empty } from 'antd'
import { EmptyProps } from 'antd/lib/empty'
import React from 'react'
import { useProvider } from 'src/fixtures/wallet/hooks'

export const NotConnectedAndEmpty = (props: EmptyProps) => {
  const { accountAddress } = useProvider()
  const isConnected = Boolean(accountAddress)
  const description = isConnected ? 'No Data' : 'Please sign in'

  return <Empty description={description} {...props} />
}
