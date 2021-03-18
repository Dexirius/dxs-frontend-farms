import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text, Button }  from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
// import { getBalanceNumber } from 'utils/formatBalance'
// import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
// import { useFarms, usePriceBnbBusd, usePriceCakeBusd, usePools } from 'state/hooks'
// import useI18n from 'hooks/useI18n'
// import useWeb3 from 'hooks/useWeb3'
import { getWeb3 } from 'utils/web3'
// import { getCakeAddress } from 'utils/addressHelpers'
// import { QuoteToken } from 'config/constants/types'
import { AbiItem } from 'web3-utils'
import MemberslAbi from 'config/abi/members.json'
import ChefAbi from 'config/abi/chef.json'
import addresses from 'config/constants/contracts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
// import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const Register = () => {
  // const TranslateString = useI18n()
  const { account } = useWallet()
  const url = `${window.location.origin}/?ref=`
  const [mm, setMm] = useState(null)
  const [isMsg, setIsMsg] = useState(false)
  const [isError, setIsError] = useState(false)
  const [_total, setTotal] = useState(0)

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
        })
      await m.methods
        .refPercent(1)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
        })
      await m.methods
        .refPercent(2)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
        })
      await m.methods
        .refPercent(3)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
        })
      await m.methods
        .refPercent(4)
        .call()
        .then(async (result) => {
          total += parseFloat(result)
        })
      const r = new BigNumber(total).div(new BigNumber(10).pow(18))
      setTotal(parseFloat(r.toString()))
    }
    init()
  }, [])

  const copyLink = async () => {
    const web3 = getWeb3()
    const m = new web3.eth.Contract((MemberslAbi as unknown) as AbiItem, addresses.members)

    m.methods
      .isMember(account)
      .call()
      .then((result) => {
        if (result === true) {
          setIsMsg(true)
          setMm('The referral link was copied correctly')
        } else {
          setIsMsg(true)
          setIsError(true)
          setMm('To win from your friends, you need to have played at least once.')
        }
      })
      .catch(() => {
        setIsMsg(true)
        setIsError(true)
        setMm('An error occurred try again')
      })
  }

  return (
    <StyledCakeStats className="referidos_container">
      <CardBody className="referidos_container">
        <Heading size="lg" mb="24px">
          Referral link
        </Heading>
        <Row>
          <Text fontSize="14px">
            {`Earn up to ${_total} percent of up to 5 levels of your network structure that your referrals claim.`}
          </Text>
        </Row>
        <Row>
          {account === null && (
            <Button fullWidth disabled>
              Copy link
            </Button>
          )}
          {account !== null && (
            <>
              <CopyToClipboard text={`${url}${account}`} onCopy={() => copyLink()}>
                <Button fullWidth>Copy link</Button>
              </CopyToClipboard>
            </>
          )}
        </Row>
        {isMsg === true && (
          <Row>
            {isError === false && (
              <Text fontSize="14px" className="register_exito">
                {mm}
              </Text>
            )}
            {isError === true && (
              <Text fontSize="14px" className="register_error">
                {mm}
              </Text>
            )}
          </Row>
        )}
      </CardBody>
    </StyledCakeStats>
  )
}

export default Register
