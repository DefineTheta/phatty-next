import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { selectHextotal, selectWalletTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ChainProtocolItem from './ChainProtocolItem';

export type IChainProtocolListProps = {
  currentAssetChain: string;
};

const ChainProtocolList = ({ currentAssetChain }: IChainProtocolListProps) => {
  const walletTotal = useSelector(useCallback(selectWalletTotal, []));
  const hexTotal = useSelector(useCallback(selectHextotal, []));

  const protocolData = useMemo(
    () => [
      {
        protocolName: 'Wallet',
        totalAmount: formatToMoney(walletTotal),
        imgSrc: '/img/icon/wallet.svg',
        imgAlt: 'Wallet',
        linkHref: '#wallet'
      },
      {
        protocolName: 'Hex',
        totalAmount: formatToMoney(hexTotal),
        imgSrc: '/img/icon/hex.svg',
        imgAlt: 'Hex',
        linkHref: '#hex'
      }
    ],
    [walletTotal, hexTotal]
  );

  return (
    <div className="flex flex-row flex-wrap gap-x-10">
      {protocolData.map((protocol, index) => (
        <ChainProtocolItem
          key={index}
          protocolName={protocol.protocolName}
          totalAmount={protocol.totalAmount}
          imgSrc={protocol.imgSrc}
          imgAlt={protocol.imgAlt}
          linkHref={protocol.linkHref}
        />
      ))}
    </div>
  );
};

export default ChainProtocolList;
