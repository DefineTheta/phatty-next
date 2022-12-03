import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import {
  selectBundleHedrontotal,
  selectBundleHextotal,
  selectBundlePancakeTotal,
  selectBundlePhamousTotal,
  selectBundlePhiatTotal,
  selectBundlePulsexTotal,
  selectBundleSushiTotal,
  selectBundleUniV2Total,
  selectBundleUniV3Total,
  selectBundleWalletTotal,
  selectBundleXenTotal
} from '@app-src/store/bundles/selectors';
import {
  selectHextotal,
  selectPancakeTotal,
  selectPhiatTotal,
  selectProfileHedronTotal,
  selectProfilePhamousTotal,
  selectProfileXenTotal,
  selectPulsexTotal,
  selectSushiTotal,
  selectUniV2Total,
  selectUniV3Total,
  selectWalletTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ChainProtocolItem from './ChainProtocolItem';

export type IChainProtocolListProps = {
  page: 'profile' | 'bundle';
  currentAssetChains: PortfolioChain[];
};

const ChainProtocolList = ({ page, currentAssetChains }: IChainProtocolListProps) => {
  const walletTotal = useSelector(
    useCallback(page === 'profile' ? selectWalletTotal('') : selectBundleWalletTotal(''), [page])
  );
  const hexTotal = useSelector(
    useCallback(page === 'profile' ? selectHextotal : selectBundleHextotal, [page])
  );
  const phiatTotal = useSelector(
    useCallback(page === 'profile' ? selectPhiatTotal : selectBundlePhiatTotal, [page])
  );
  const pulsexTotal = useSelector(
    useCallback(page === 'profile' ? selectPulsexTotal : selectBundlePulsexTotal, [page])
  );
  const pancakeTotal = useSelector(
    useCallback(page === 'profile' ? selectPancakeTotal : selectBundlePancakeTotal, [page])
  );
  const sushiTotal = useSelector(
    useCallback(page === 'profile' ? selectSushiTotal : selectBundleSushiTotal, [page])
  );
  const uniV2Total = useSelector(
    useCallback(page === 'profile' ? selectUniV2Total : selectBundleUniV2Total, [page])
  );
  const uniV3Total = useSelector(
    useCallback(page === 'profile' ? selectUniV3Total : selectBundleUniV3Total, [page])
  );
  const hedronTotal = useSelector(
    useCallback(page === 'profile' ? selectProfileHedronTotal : selectBundleHedrontotal, [page])
  );
  const phamousTotal = useSelector(
    useCallback(page === 'profile' ? selectProfilePhamousTotal : selectBundlePhamousTotal, [page])
  );

  const xenTotal = useSelector(
    useCallback(page === 'profile' ? selectProfileXenTotal : selectBundleXenTotal, [page])
  );

  const protocolData = useMemo(
    () => [
      {
        protocolName: 'Wallet',
        totalAmount: walletTotal,
        displayTotalAmount: formatToMoney(walletTotal),
        imgSrc: '/img/icon/wallet.svg',
        imgAlt: 'Wallet',
        linkHref: '#wallet'
      },
      {
        protocolName: 'Hex',
        totalAmount: hexTotal,
        displayTotalAmount: formatToMoney(hexTotal),
        imgSrc: '/img/icon/hex.svg',
        imgAlt: 'Hex',
        linkHref: '#hex'
      },
      {
        protocolName: 'Phiat',
        totalAmount: phiatTotal,
        displayTotalAmount: formatToMoney(phiatTotal),
        imgSrc: '/img/icon/phiat.png',
        imgAlt: 'Phiat',
        linkHref: '#phiat'
      },
      {
        protocolName: 'PulseX',
        totalAmount: pulsexTotal,
        displayTotalAmount: formatToMoney(pulsexTotal),
        imgSrc: '/img/tokens/pulsex.jpeg',
        imgAlt: 'Pulsex',
        linkHref: '#pulsex'
      },
      {
        protocolName: 'Pancake',
        totalAmount: pancakeTotal,
        displayTotalAmount: formatToMoney(pancakeTotal),
        imgSrc: '/img/icon/pancake.svg',
        imgAlt: 'Pancake',
        linkHref: '#pancake'
      },
      {
        protocolName: 'Sushi',
        totalAmount: sushiTotal,
        displayTotalAmount: formatToMoney(sushiTotal),
        imgSrc: '/img/icon/sushi.svg',
        imgAlt: 'Sushi',
        linkHref: '#sushi'
      },
      {
        protocolName: 'Uniswap V2',
        totalAmount: uniV2Total,
        displayTotalAmount: formatToMoney(uniV2Total),
        imgSrc: '/img/icon/univ2.svg',
        imgAlt: 'Uniswap version 2',
        linkHref: '#univ2'
      },
      {
        protocolName: 'Uniswap V3',
        totalAmount: uniV3Total,
        displayTotalAmount: formatToMoney(uniV3Total),
        imgSrc: '/img/icon/univ2.svg',
        imgAlt: 'Uniswap version 3',
        linkHref: '#univ3'
      },
      {
        protocolName: 'Hedron',
        totalAmount: hedronTotal,
        displayTotalAmount: formatToMoney(hedronTotal),
        imgSrc: '/img/icon/hedron.webp',
        imgAlt: 'Hedron',
        linkHref: '#hedron'
      },
      {
        protocolName: 'Phamous',
        totalAmount: phamousTotal,
        displayTotalAmount: formatToMoney(phamousTotal),
        imgSrc: '/img/icon/phamous_table.svg',
        imgAlt: 'Phamous',
        linkHref: '#phamous'
      },
      {
        protocolName: 'Xen',
        totalAmount: xenTotal,
        displayTotalAmount: formatToMoney(xenTotal),
        imgSrc: '/img/icon/xen.png',
        imgAlt: 'Xen',
        linkHref: '#xen'
      }
    ],
    [
      walletTotal,
      hexTotal,
      phiatTotal,
      pulsexTotal,
      pancakeTotal,
      sushiTotal,
      uniV2Total,
      uniV3Total,
      hedronTotal,
      phamousTotal,
      xenTotal
    ]
  );

  return (
    <div className="flex flex-row flex-wrap gap-x-10 gap-y-10">
      {protocolData.map((protocol, index) => {
        if (protocol.totalAmount !== 0) {
          return (
            <ChainProtocolItem
              key={index}
              protocolName={protocol.protocolName}
              totalAmount={protocol.displayTotalAmount}
              imgSrc={protocol.imgSrc}
              imgAlt={protocol.imgAlt}
              linkHref={protocol.linkHref}
            />
          );
        }
      })}
    </div>
  );
};

export default ChainProtocolList;
