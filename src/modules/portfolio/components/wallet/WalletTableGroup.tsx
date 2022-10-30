import TableError from '@app-src/common/components/table/TableError';
import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import {
  selectBundleWalletLoading,
  selectBundleWalletTotal
} from '@app-src/store/bundles/selectors';
import { fetchWalletData } from '@app-src/store/protocol/protocolSlice';
import {
  selectWalletError,
  selectWalletLoading,
  selectWalletTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import WalletTable from './WalletTable';

type IWalletTableGroupProps = {
  page: 'profile' | 'bundle';
};

const WalletTableGroup = ({ page }: IWalletTableGroupProps) => {
  const dispatch = useAppDispatch();

  const walletTotal = useSelector(
    useCallback(page === 'profile' ? selectWalletTotal : selectBundleWalletTotal, [page])
  );
  const loading = useSelector(
    useCallback(page === 'profile' ? selectWalletLoading : selectBundleWalletLoading, [page])
  );
  const error = useSelector(useCallback(selectWalletError, []));

  const styledWalletTotal = useMemo(() => formatToMoney(walletTotal), [walletTotal]);

  const fetchTableData = useCallback(() => {
    dispatch(fetchWalletData());
  }, []);

  if (!loading && !error && walletTotal === 0) {
    return null;
  }

  return (
    <div id="wallet" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Wallet"
        totalValue={styledWalletTotal}
        tablePrimaryImgSrc="/img/icon/wallet.svg"
        tablePrimaryImgAlt="Wallet"
      />
      {error ? (
        <TableError retry={fetchTableData} />
      ) : (
        <WalletTable page={page} loading={loading} />
      )}
    </div>
  );
};

export default WalletTableGroup;
