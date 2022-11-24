import Card from '@app-src/common/components/layout/Card';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainSummaryItem from '@app-src/modules/chain/components/ChainSummaryItem';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import {
  selectBundleAvaxTotal,
  selectBundleBscTotal,
  selectBundleEthereumTotal,
  selectBundleMaticTotal,
  selectBundleTotal,
  selectBundleTplsTotal
} from '@app-src/store/bundles/selectors';
import {
  selectAvaxTotal,
  selectBscTotal,
  selectEthereumTotal,
  selectMaticTotal,
  selectTotal,
  selectTplsTotal
} from '@app-src/store/protocol/selectors';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import ChainProtocolList from './ChainProtocolList';

type IChainSummaryCardProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const ChainSummaryCard = ({ page, chain: currentChain }: IChainSummaryCardProps) => {
  const router = useRouter();

  const total = useAppSelector(
    useCallback(page === 'profile' ? selectTotal : selectBundleTotal, [page])
  );
  const ethereumTotal = useAppSelector(
    useCallback(page === 'profile' ? selectEthereumTotal : selectBundleEthereumTotal, [page])
  );
  const bscTotal = useAppSelector(
    useCallback(page === 'profile' ? selectBscTotal : selectBundleBscTotal, [page])
  );
  const tplsTotal = useAppSelector(
    useCallback(page === 'profile' ? selectTplsTotal : selectBundleTplsTotal, [page])
  );

  const maticTotal = useAppSelector(
    useCallback(page === 'profile' ? selectMaticTotal : selectBundleMaticTotal, [page])
  );

  const avaxTotal = useAppSelector(
    useCallback(page === 'profile' ? selectAvaxTotal : selectBundleAvaxTotal, [page])
  );

  const testData = [
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
    }
  ];

  const handleChainClick = (chain: PortfolioChain) => {
    router.push(
      {
        pathname: router.asPath.split('?')[0],
        query: currentChain !== chain ? { chain } : undefined
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
                    selected={currentChain === '' || currentChain === chain.chainId}
                  />
                </button>
              )
          )}
        </div>
        <ChainProtocolList currentAssetChain={currentChain} page={page} />
      </div>
    </Card>
  );
};

export default ChainSummaryCard;
