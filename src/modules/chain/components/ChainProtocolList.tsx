import {
  Portfolio,
  PortfolioChain,
  PortfolioProtocol
} from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { isProtocolInCurrnetChains } from '@app-src/modules/portfolio/utils/misc';
import {
  selectHedronTotal,
  selectHexTotal,
  selectIcosaTotal,
  selectPancakeTotal,
  selectPhamousTotal,
  selectPhiatTotal,
  selectPulsexTotal,
  selectSushiTotal,
  selectUniV2Total,
  selectUniV3Total,
  selectWalletTotal,
  selectXenTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ChainProtocolItem from './ChainProtocolItem';

export type IChainProtocolListProps = {
  page: Portfolio;
  currentAssetChains: PortfolioChain[];
};

type ProtocolData = {
  protocolName: PortfolioProtocol;
  protocolDisplayName: string;
  totalAmount: number;
  displayTotalAmount: string;
  imgSrc: string;
  imgAlt: string;
  linkHref: string;
};

const ChainProtocolList = ({ page, currentAssetChains }: IChainProtocolListProps) => {
  const walletTotal = useSelector(useCallback(selectWalletTotal(currentAssetChains, page), [page]));
  const hexTotal = useSelector(useCallback(selectHexTotal(page), [page]));
  const phiatTotal = useSelector(useCallback(selectPhiatTotal(page), [page]));
  const pulsexTotal = useSelector(useCallback(selectPulsexTotal(page), [page]));
  const pancakeTotal = useSelector(useCallback(selectPancakeTotal(page), [page]));
  const sushiTotal = useSelector(useCallback(selectSushiTotal(page), [page]));
  const uniV2Total = useSelector(useCallback(selectUniV2Total(page), [page]));
  const uniV3Total = useSelector(useCallback(selectUniV3Total(page), [page]));
  const hedronTotal = useSelector(useCallback(selectHedronTotal(page), [page]));
  const phamousTotal = useSelector(useCallback(selectPhamousTotal(page), [page]));
  const xenTotal = useSelector(useCallback(selectXenTotal(page), [page]));
  const icosaTotal = useSelector(useCallback(selectIcosaTotal(page), [page]));

  const protocolData = useMemo<ProtocolData[]>(
    () => [
      {
        protocolName: 'WALLET',
        protocolDisplayName: 'Wallet',
        totalAmount: walletTotal,
        displayTotalAmount: formatToMoney(walletTotal),
        imgSrc: '/img/icon/wallet.svg',
        imgAlt: 'Wallet',
        linkHref: '#wallet'
      },
      {
        protocolName: 'HEX',
        protocolDisplayName: 'Hex',
        totalAmount: hexTotal,
        displayTotalAmount: formatToMoney(hexTotal),
        imgSrc: '/img/icon/hex.svg',
        imgAlt: 'Hex',
        linkHref: '#hex'
      },
      {
        protocolName: 'PHIAT',
        protocolDisplayName: 'Phiat',
        totalAmount: phiatTotal,
        displayTotalAmount: formatToMoney(phiatTotal),
        imgSrc: '/img/icon/phiat.png',
        imgAlt: 'Phiat',
        linkHref: '#phiat'
      },
      {
        protocolName: 'PULSEX',
        protocolDisplayName: 'PulseX',
        totalAmount: pulsexTotal,
        displayTotalAmount: formatToMoney(pulsexTotal),
        imgSrc: '/img/tokens/pulsex.jpeg',
        imgAlt: 'Pulsex',
        linkHref: '#pulsex'
      },
      {
        protocolName: 'PANCAKE',
        protocolDisplayName: 'Pancake',
        totalAmount: pancakeTotal,
        displayTotalAmount: formatToMoney(pancakeTotal),
        imgSrc: '/img/icon/pancake.svg',
        imgAlt: 'Pancake',
        linkHref: '#pancake'
      },
      {
        protocolName: 'SUSHI',
        protocolDisplayName: 'Sushi',
        totalAmount: sushiTotal,
        displayTotalAmount: formatToMoney(sushiTotal),
        imgSrc: '/img/icon/sushi.svg',
        imgAlt: 'Sushi',
        linkHref: '#sushi'
      },
      {
        protocolName: 'UNISWAPV2',
        protocolDisplayName: 'Uniswap V2',
        totalAmount: uniV2Total,
        displayTotalAmount: formatToMoney(uniV2Total),
        imgSrc: '/img/icon/univ2.svg',
        imgAlt: 'Uniswap version 2',
        linkHref: '#univ2'
      },
      {
        protocolName: 'UNISWAPV3',
        protocolDisplayName: 'Uniswap V3',
        totalAmount: uniV3Total,
        displayTotalAmount: formatToMoney(uniV3Total),
        imgSrc: '/img/icon/univ2.svg',
        imgAlt: 'Uniswap version 3',
        linkHref: '#univ3'
      },
      {
        protocolName: 'HEDRON',
        protocolDisplayName: 'Hedron',
        totalAmount: hedronTotal,
        displayTotalAmount: formatToMoney(hedronTotal),
        imgSrc: '/img/icon/hedron.webp',
        imgAlt: 'Hedron',
        linkHref: '#hedron'
      },
      {
        protocolName: 'PHAMOUS',
        protocolDisplayName: 'Phamous',
        totalAmount: phamousTotal,
        displayTotalAmount: formatToMoney(phamousTotal),
        imgSrc: '/img/icon/phamous_table.svg',
        imgAlt: 'Phamous',
        linkHref: '#phamous'
      },
      {
        protocolName: 'XEN',
        protocolDisplayName: 'Xen',
        totalAmount: xenTotal,
        displayTotalAmount: formatToMoney(xenTotal),
        imgSrc: '/img/icon/xen.png',
        imgAlt: 'Xen',
        linkHref: '#xen'
      },
      {
        protocolName: 'ICOSA',
        protocolDisplayName: 'Icosa',
        totalAmount: icosaTotal,
        displayTotalAmount: formatToMoney(icosaTotal),
        imgSrc: '/img/icon/icosa.png',
        imgAlt: 'Icosa',
        linkHref: '#icosa'
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
      xenTotal,
      icosaTotal
    ]
  );

  const filteredProtocolData = useMemo<ProtocolData[]>(
    () =>
      protocolData.filter((data) =>
        isProtocolInCurrnetChains(data.protocolName, currentAssetChains)
      ),
    [protocolData, currentAssetChains]
  );

  return (
    <div className="flex flex-row flex-wrap gap-x-10 gap-y-10">
      {filteredProtocolData.map((protocol, index) => {
        if (protocol.totalAmount !== 0) {
          return (
            <ChainProtocolItem
              key={index}
              protocolName={protocol.protocolDisplayName}
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
