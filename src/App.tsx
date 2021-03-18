import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ResetCSS } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import queryString from 'query-string'
import { getWeb3 } from 'utils/web3'
import { useFetchPublicData } from 'state/hooks'
import { AbiItem } from 'web3-utils'
import MemberslAbi from 'config/abi/members.json'
import addresses from 'config/constants/contracts'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import PageLoader from './components/PageLoader'
import NftGlobalNotification from './views/Nft/components/NftGlobalNotification'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Network = lazy(() => import('./views/Network'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Nft = lazy(() => import('./views/Nft'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  useEffect(() => {
    console.warn = () => null
  }, [])

  useFetchPublicData()

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3()
      const m = new web3.eth.Contract((MemberslAbi as unknown) as AbiItem, addresses.members)
      const params = queryString.parse(window.location.search)

      if (params.ref && params.ref !== null && params.ref !== undefined) {
        try {
          m.methods
            .members(params.ref)
            .call()
            .then((result) => {
              if (result.isExist === true) {
                localStorage.setItem('sponsor', `${params.ref}`)
              } else {
                try {
                  m.methods
                    .membersList(0)
                    .call()
                    .then((result1) => {
                      localStorage.setItem('sponsor', `${result1}`)
                    })
                } catch (error) {
                  localStorage.removeItem('sponsor')
                }
              }
            })
        } catch (error0) {
          try {
            m.methods
              .membersList(0)
              .call()
              .then((result2) => {
                localStorage.setItem('sponsor', `${result2}`)
              })
          } catch (error1) {
            localStorage.removeItem('sponsor')
          }
        }
      } else {
        const _sponsor = localStorage.getItem('sponsor')
        if (_sponsor !== 'undefined' && _sponsor !== null) {
          try {
            m.methods
              .members(_sponsor)
              .call()
              .then((result3) => {
                if (result3.isExist === true) {
                  localStorage.setItem('sponsor', `${_sponsor}`)
                } else {
                  try {
                    m.methods
                      .membersList(0)
                      .call()
                      .then((result4) => {
                        localStorage.setItem('sponsor', `${result4}`)
                      })
                  } catch (error) {
                    localStorage.removeItem('sponsor')
                  }
                }
              })
          } catch (error) {
            try {
              m.methods
                .membersList(0)
                .call()
                .then((result5) => {
                  localStorage.setItem('sponsor', `${result5}`)
                })
            } catch (error4) {
              localStorage.removeItem('sponsor')
            }
          }
        } else {
          try {
            m.methods
              .membersList(0)
              .call()
              .then((result6) => {
                localStorage.setItem('sponsor', `${result6}`)
              })
          } catch (error) {
            localStorage.removeItem('sponsor')
          }
        }
      }
    }
    setTimeout(() => {
      init()
    }, 4000)
  }, [])

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
            </Route>
            <Route path="/nests">
              <Farms tokenMode />
            </Route>
            <Route path="/network">
              <Network />
            </Route>
            {/* <Route path="/pools"> */}
            {/*  <Pools /> */}
            {/* </Route> */}
            {/* <Route path="/lottery"> */}
            {/*  <Lottery /> */}
            {/* </Route> */}
            {/* <Route path="/ifo"> */}
            {/*  <Ifos /> */}
            {/* </Route> */}
            {/* <Route path="/nft"> */}
            {/*  <Nft /> */}
            {/* </Route> */}
            {/* Redirect */}
            {/* <Route path="/staking"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* <Route path="/syrup"> */}
            {/*  <Redirect to="/pools" /> */}
            {/* </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
      <NftGlobalNotification />
    </Router>
  )
}

export default React.memo(App)
