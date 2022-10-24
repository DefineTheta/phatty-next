import Card from '@app-src/common/components/layout/Card';
import ChainSummaryItem from '@app-src/modules/chain/components/ChainSummaryItem';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import {
  selectBscTotal,
  selectEthereumTotal,
  selectTotal,
  selectTplsTotal
} from '@app-src/store/protocol/selectors';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ChainProtocolList from './ChainProtocolList';

const ChainSummaryCard = () => {
  const total = useSelector(useCallback(selectTotal, []));
  const ethereumTotal = useSelector(useCallback(selectEthereumTotal, []));
  const bscTotal = useSelector(useCallback(selectBscTotal, []));
  const tplsTotal = useSelector(useCallback(selectTplsTotal, []));

  const testData = [
    {
      imgSrc: '/img/chains/eth.svg',
      imgAlt: 'Ethereum logo',
      displayName: 'Ethereum',
      total: ethereumTotal,
      displayTotal: formatToMoney(ethereumTotal),
      percentage: styleNumber((ethereumTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/bsc.svg',
      imgAlt: 'Binance logo',
      displayName: 'BSC',
      total: bscTotal,
      displayTotal: formatToMoney(bscTotal),
      percentage: styleNumber((bscTotal / total) * 100, 2) + '%'
    },
    {
      imgSrc: '/img/chains/tpls.svg',
      imgAlt: 'Pulsechain logo',
      displayName: 'TPLS',
      total: tplsTotal,
      displayTotal: formatToMoney(tplsTotal),
      percentage: styleNumber((tplsTotal / total) * 100, 2) + '%'
    }
  ];

  return (
    <Card>
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row flex-wrap gap-y-18 gap-x-20">
          {testData.map(
            (chain, index) =>
              chain.total > 0 && (
                <ChainSummaryItem
                  key={index}
                  imgSrc={chain.imgSrc}
                  imgAlt={chain.imgAlt}
                  chainDisplayName={chain.displayName}
                  chainTotal={chain.displayTotal}
                  chainPercentage={chain.percentage}
                />
              )
          )}
        </div>
        <ChainProtocolList currentAssetChain="eth" />
      </div>
    </Card>
  );
};

export default ChainSummaryCard;
