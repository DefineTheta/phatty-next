import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import {
  selectBundleHextotal,
  selectBundlePancakeTotal,
  selectBundlePhiatTotal,
  selectBundlePulsexTotal,
  selectBundleWalletTotal
} from '@app-src/store/bundles/selectors';
import {
  selectHextotal,
  selectPancakeTotal,
  selectPhiatTotal,
  selectPulsexTotal,
  selectWalletTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ChainProtocolItem from './ChainProtocolItem';

export type IChainProtocolListProps = {
  page: 'profile' | 'bundle';
  currentAssetChain: string;
};

const ChainProtocolList = ({ page, currentAssetChain }: IChainProtocolListProps) => {
  const walletTotal = useSelector(
    useCallback(page === 'profile' ? selectWalletTotal : selectBundleWalletTotal, [page])
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
        imgSrc: '/img/tokens/phsac.png',
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
      }
    ],
    [walletTotal, hexTotal, phiatTotal, pulsexTotal, pancakeTotal]
  );

  return (
    <div className="flex flex-row flex-wrap gap-x-10">
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
