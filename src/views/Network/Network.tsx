import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
// import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import { getWeb3 } from 'utils/web3'
// import { useSelector, useDispatch } from 'react-redux'
// import FlexLayout from 'components/layout/Flex'


// import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
// import CakeStats from 'views/Home/components/CakeStats'
// import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import { AbiItem } from 'web3-utils'
import MemberslAbi from 'config/abi/members.json'
import ChefAbi from 'config/abi/chef.json'
import addresses from 'config/constants/contracts'
import useWeb3 from 'hooks/useWeb3'
// import { State, TeamsState } from '../../state/types'
import Tree from './Tree'
import imgLoading from '../../config/img/loading.gif'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`

// const Cards = styled(BaseLayout)`
//   align-items: stretch;
//   justify-content: stretch;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//     width: 100%;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 6;
//     }
//   }
// `
// const Row = styled.div`
//   align-items: center;
//   display: flex;
//   font-size: 14px;
//   justify-content: space-between;
//   margin-bottom: 8px;
// `

type MyWindow = typeof window & {
  m: any
}

interface jsonProps {
  id: string
  address: string
  children: any
  title: string
  innerWidth: any
}

const Network = () => {
  // const TranslateString = useI18n()
  const { account }: { account: string } = useWallet()
  // const account = '0x3c85EC98DF475Fd0049467377258424cd735CFEC'
  const web32 = useWeb3()
  const [data, setData] = useState<jsonProps>({ id: '', address: '', children: [], title: '', innerWidth: '' })
  const [dataStatus, setDataStatus] = useState(null)
  const [mm, setMm] = useState(null)
  const [_total, setTotal] = useState(0)
  const [_val1, setVal1] = useState(0)
  const [_val2, setVal2] = useState(0)
  const [_val3, setVal3] = useState(0)
  const [_val4, setVal4] = useState(0)
  const [_val5, setVal5] = useState(0)
  const [ancho, setAncho] = useState(window.innerWidth)


  window.addEventListener('resize', () => {
    setAncho(window.innerWidth)
  })


  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3()
      const m = new web3.eth.Contract((ChefAbi as unknown) as AbiItem, addresses.chef)
      let total = 0
      await m.methods
        .refPercent(0)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
          setVal1(result)
        })
      await m.methods
        .refPercent(1)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
          setVal2(result)
        })
      await m.methods
        .refPercent(2)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
          setVal3(result)
        })
      await m.methods
        .refPercent(3)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
          setVal4(result)
        })
      await m.methods
        .refPercent(4)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
          setVal5(result)
        })
      const r = new BigNumber(total).div(new BigNumber(10).pow(18))
      setTotal(parseFloat(r.toString()))
    }
    init()
  }, [])

  useEffect(() => {
    const init = async () => {
      if (account !== null) {
        const web3 = getWeb3()
        const m = new web3.eth.Contract((MemberslAbi as unknown) as AbiItem, addresses.members)
        ;(window as MyWindow).m = m
        setMm(m)
        await m.methods
          .members(account)
          .call()
          .then(async (result) => {
            const treeData: jsonProps = {
              id: account,
              address: account,
              children: [],
              title: account,
              innerWidth: ancho,
            }
            if (result.referredUsers > 0) {
              /* eslint-disable no-await-in-loop */
              for (let i = 0; i < result.referredUsers; i++) {
                await m.methods
                  .memberChild(result.id, i)
                  .call()
                  .then(async (rm) => {
                    await m.methods
                      .members(rm)
                      .call()
                      .then(async (r) => {
                        if (r.isExist === true && account !== rm) {
                          treeData.children.push({
                            id: rm,
                            address: rm,
                            children: [],
                            title: rm,
                            innerWidth: ancho,
                          })
                        }
                      })
                  })
              }
            }
            setData(treeData)
            setDataStatus(true)
          })
      }
    }
    init()
  }, [account, web32, ancho])

  const x = (n) => {
    return parseFloat(new BigNumber(n).div(new BigNumber(10).pow(18)).toString())
  }

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          Network structure
        </Heading>
        <Text>
          Build your network and enjoy a small percentage of what your network mines in yields farming
        </Text>
      </Hero>
      <div className="tree_center">
        <div className="tree text-center">
          { dataStatus !== null && <Tree json={data} ancho={ancho} m={mm} /> }
          { dataStatus === null && <><img src={imgLoading} alt="" /></> }
        </div>
      </div>
      <div className="tree_center mt_net">
        <Heading as="h2" size="xl" mb="24px" color="secondary">
          Percentages of the network
        </Heading>
        <Text>
          {`Earn up to ${_total} percent of up to 5 levels of your network structure that your referrals claim.`}
        </Text>
        <p className="mt-3">
          <Text>
            {`Level 1: ${x(_val1)}%, Level 2: ${x(_val2)}%, Level 3: ${x(_val3)}%, Level 4: ${x(_val4)}%, Level 5: ${x(
                _val5,
              )}%`}
          </Text>
        </p>
      </div>
    </Page>
  )
}

export default Network
