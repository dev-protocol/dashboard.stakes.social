import * as React from 'react'
import App, { AppInitialProps } from 'next/app'
import { WithApolloProps } from 'next-with-apollo'
import Head from 'next/head'
import SettingContext from 'src/context/settingContext'
import WalletContext from 'src/context/walletContext'
import { ChainName } from 'src/fixtures/wallet/utility'
import Web3 from 'web3'
import { message } from 'antd'
import * as gtag from 'src/lib/gtag'
import { Router } from 'next/router'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { providers } from 'ethers'

const cache = new InMemoryCache()
const client = new ApolloClient({
  uri: 'https://api.devprotocol.xyz/v1/graphql',
  cache
})

class NextApp extends App<AppInitialProps & WithApolloProps<{}>> {
  state = { isCurrencyDEV: true, web3: undefined, ethersProvider: undefined, selectedChain: 'ethereum' }

  componentDidMount = () => {
    message.config({
      maxCount: 5
    })

    const settings = localStorage.getItem('settings')
    if (settings) {
      const { currency } = JSON.parse(settings)
      this.setState({ isCurrencyDEV: currency === 'DEV' })
    }

    // Google Analytics
    Router.events.on('routeChangeComplete', url => gtag.pageview(url))
  }

  createProviderUpdater(provider: any) {
    return () => {
      const web3: any = new Web3(provider)
      const ethersProvider = new providers.Web3Provider(provider)
      this.setProviders(web3, ethersProvider)
      return { web3, ethersProvider }
    }
  }

  setProviders = (web3: Web3, ethersProvider: providers.BaseProvider) => {
    this.setState({ web3, ethersProvider })
  }

  toggleCurrency = () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({ currency: !this.state.isCurrencyDEV ? 'DEV' : 'USD', selectedChain: this.state.selectedChain })
    )
    this.setState({ isCurrencyDEV: !this.state.isCurrencyDEV, selectedChain: this.state.selectedChain })
  }

  setChain = (chain: ChainName) => {
    localStorage.setItem(
      'settings',
      JSON.stringify({ currency: !this.state.isCurrencyDEV ? 'DEV' : 'USD', selectedChain: chain })
    )
    this.setState({ isCurrencyDEV: !this.state.isCurrencyDEV, selectedChain: chain })
  }

  render() {
    const { Component, pageProps, apollo } = this.props

    return (
      <ApolloProvider client={client}>
        <WalletContext.Provider
          value={{
            web3: this.state.web3,
            ethersProvider: this.state.ethersProvider,
            setProviders: this.setProviders
          }}
        >
          <SettingContext.Provider
            value={{
              isCurrencyDEV: this.state.isCurrencyDEV,
              toggleCurrency: this.toggleCurrency,
              selectedChain: 'ethereum',
              setChain: this.setChain
            }}
          >
            <Head>
              <title>Stakes.social</title>
              {/* Use minimum-scale=1 to enable GPU rasterization */}
              <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            </Head>
            <Component {...pageProps} apollo={apollo} />
          </SettingContext.Provider>
        </WalletContext.Provider>
      </ApolloProvider>
    )
  }
}

export default NextApp
