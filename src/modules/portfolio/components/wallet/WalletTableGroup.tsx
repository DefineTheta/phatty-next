import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundleWalletData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleWalletError,
  selectBundleWalletLoading,
  selectBundleWalletTotal
} from '@app-src/store/bundles/selectors';
import { fetchWalletData } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfileWalletError,
  selectWalletLoading,
  selectWalletTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import WalletTable from './WalletTable';

type IWalletTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const WalletTableGroup = ({ page, chain }: IWalletTableGroupProps) => {
  const dispatch = useAppDispatch();

  const walletTotal = useAppSelector(
    useCallback(page === 'profile' ? selectWalletTotal : selectBundleWalletTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectWalletLoading : selectBundleWalletLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileWalletError : selectBundleWalletError, [page])
  );

  const styledWalletTotal = useMemo(() => formatToMoney(walletTotal), [walletTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchWalletData());
    else dispatch(fetchBundleWalletData());
  }, [page, dispatch]);

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
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <WalletTable page={page} chain={chain} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default WalletTableGroup;
