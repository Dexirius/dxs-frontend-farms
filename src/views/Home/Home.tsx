import React from 'react'
import styled from 'styled-components'
import {  BaseLayout } from '@pancakeswap-libs/uikit'
// import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import FarmStakingCard from './components/FarmStakingCard'
// import LotteryCard from './components/LotteryCard'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import Register from './components/Register'

const Hero = styled.div`
  align-items: center;
  // background-image: url('/images/pan-bg-mobile.svg');
  background-image: url('/images/logo_home_movil.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 20px;

  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/logo_home.svg');
    // background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    // background-position: left center, right center;
    height: 115px;
    padding-top: 0;
    margin-bottom: 30px;
    margin-top: 0px;
  }
`
const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;
  & > div {
    grid-column: span 12;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 12;
    }
  }
`

const Home: React.FC = () => {
  // const TranslateString = useI18n()

  return (
    <Page>
      <Hero>
        {/* <Heading as="h1" size="xl" mb="24px" color="secondary">
          {TranslateString(576, 'Dexirius Finance')}
        </Heading>
        <Text>{TranslateString(578, 'The coldest Yield Farming on Binance Smart Chain')}</Text> */}
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          <TwitterCard />
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
        <div className="referidos_container">
          <CTACards className="referidos_container">
            <Register />
          </CTACards>
        </div>        
      </div>
    </Page>
  )
}

export default Home
