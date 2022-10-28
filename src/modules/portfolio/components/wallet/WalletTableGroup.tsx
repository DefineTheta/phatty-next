import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectWalletLoading, selectWalletTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import WalletTable from './WalletTable';

const WalletTableGroup = () => {
  const walletTotal = useSelector(useCallback(selectWalletTotal, []));
  const loading = useSelector(useCallback(selectWalletLoading, []));

  const styledWalletTotal = useMemo(() => formatToMoney(walletTotal), [walletTotal]);

  if (!loading && walletTotal === 0) {
    return null;
  }

  return (
    <div id="#wallet" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Wallet"
        totalValue={styledWalletTotal}
        tablePrimaryImgSrc="/img/icon/wallet.svg"
        tablePrimaryImgAlt="Wallet"
      />
      <WalletTable loading={loading} />
    </div>
  );
};

export default WalletTableGroup;
