import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchWalletData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectWalletError,
  selectWalletLoading,
  selectWalletTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import WalletTable from './WalletTable';

type IWalletTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const WalletTableGroup = ({ page, currentChains }: IWalletTableGroupProps) => {
  const dispatch = useAppDispatch();

  const walletTotal = useAppSelector(
    useCallback(selectWalletTotal(currentChains, page), [page, currentChains])
  );
  const loading = useAppSelector(useCallback(selectWalletLoading(page), [page]));
  const error = useAppSelector(useCallback(selectWalletError(page), [page]));

  const styledWalletTotal = useMemo(() => formatToMoney(walletTotal), [walletTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchWalletData(page)), [page, dispatch]);

  if (!loading && !error && walletTotal === 0) {
    return null;
  }

  return (
    <div id="wallet" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Wallet"
        totalValue={styledWalletTotal}
        tablePrimaryImgSrc="/img/icon/wallet.svg"
        tablePrimaryImgAlt="Wallet"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <WalletTable page={page} chains={currentChains} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default WalletTableGroup;
