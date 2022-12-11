import Card from '@app-src/common/components/layout/Card';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainSummaryItem from '@app-src/modules/chain/components/ChainSummaryItem';
import { Portfolio, PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import {
  selectArbiTotal,
  selectAvaxTotal,
  selectBscTotal,
  selectEthereumTotal,
  selectFtmTotal,
  selectMaticTotal,
  selectTotal,
  selectTplsTotal
} from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import ChainProtocolList from './ChainProtocolList';

type IChainSummaryCardProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

type ChainCardData = {
  imgSrc: string;
  imgAlt: string;
  displayName: string;
  chainId: PortfolioChain;
  total: number;
  displayTotal: string;
  percentage: string;
};

const ChainSummaryCard = ({ page, currentChains }: IChainSummaryCardProps) => {
  const router = useRouter();

  const total = useAppSelector(useCallback(selectTotal(page), [page]));
  const ethereumTotal = useAppSelector(useCallback(selectEthereumTotal(page), [page]));
  const bscTotal = useAppSelector(useCallback(selectBscTotal(page), [page]));
  const tplsTotal = useAppSelector(useCallback(selectTplsTotal(page), [page]));
  const maticTotal = useAppSelector(useCallback(selectMaticTotal(page), [page]));
  const avaxTotal = useAppSelector(useCallback(selectAvaxTotal(page), [page]));
  const ftmTotal = useAppSelector(useCallback(selectFtmTotal(page), [page]));
  const arbiTotal = useAppSelector(useCallback(selectArbiTotal(page), [page]));

  const testData: ChainCardData[] = [
    {
      imgSrc: '/img/chains/eth.svg',
      imgAlt: 'Ethereum logo',
      displayName: 'Ethereum',
      chainId: 'ETH',
      total: ethereumTotal,
      displayTotal: formatToMoney(ethereumTotal),
      percentage: styleNumber((ethereumTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/bsc.svg',
      imgAlt: 'Binance logo',
      displayName: 'BSC',
      chainId: 'BSC',
      total: bscTotal,
      displayTotal: formatToMoney(bscTotal),
      percentage: styleNumber((bscTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/tpls.svg',
      imgAlt: 'Pulsechain logo',
      displayName: 'TPLS',
      chainId: 'TPLS',
      total: tplsTotal,
      displayTotal: formatToMoney(tplsTotal),
      percentage: styleNumber((tplsTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/matic.svg',
      imgAlt: 'Polygon logo',
      displayName: 'Polygon',
      chainId: 'MATIC',
      total: maticTotal,
      displayTotal: formatToMoney(maticTotal),
      percentage: styleNumber((maticTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/avax.svg',
      imgAlt: 'Avalanche logo',
      displayName: 'Avalanche',
      chainId: 'AVAX',
      total: avaxTotal,
      displayTotal: formatToMoney(avaxTotal),
      percentage: styleNumber((avaxTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/ftm.svg',
      imgAlt: 'Fantom logo',
      displayName: 'Fantom',
      chainId: 'FTM',
      total: ftmTotal,
      displayTotal: formatToMoney(ftmTotal),
      percentage: styleNumber((ftmTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/arbi.svg',
      imgAlt: 'Arbitrum logo',
      displayName: 'Arbitrum',
      chainId: 'ARBI',
      total: ftmTotal,
      displayTotal: formatToMoney(arbiTotal),
      percentage: styleNumber((arbiTotal / total) * 100, 2) + '%'
    }
  ];

  const handleChainClick = (chain: PortfolioChain) => {
    let updatedChains = [...currentChains];

    if (updatedChains.includes(chain)) {
      updatedChains = updatedChains.filter((chainIterator) => chainIterator != chain);
    } else {
      updatedChains.push(chain);
    }

    router.push(
      {
        pathname: router.asPath.split('?')[0],
        query: updatedChains.length > 0 ? { chains: updatedChains.join(',') } : undefined
      },
      undefined,
      {
        shallow: true
      }
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row flex-wrap gap-y-18 gap-x-20">
          {testData.map(
            (chain, index) =>
              chain.total > 0 && (
                <button
                  key={index}
                  onClick={() => handleChainClick(chain.chainId as PortfolioChain)}
                >
                  <ChainSummaryItem
                    imgSrc={chain.imgSrc}
                    imgAlt={chain.imgAlt}
                    chainDisplayName={chain.displayName}
                    chainTotal={chain.displayTotal}
                    chainPercentage={chain.percentage}
                    selected={currentChains.length === 0 || currentChains.includes(chain.chainId)}
                  />
                </button>
              )
          )}
        </div>
        <ChainProtocolList currentAssetChains={currentChains} page={page} />
      </div>
    </Card>
  );
};

export default ChainSummaryCard;
