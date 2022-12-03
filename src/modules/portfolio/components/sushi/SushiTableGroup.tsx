import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundleSushiData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleSushiError,
  selectBundleSushiLoading,
  selectBundleSushiTotal
} from '@app-src/store/bundles/selectors';
import { fetchSushiData } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfileSushiError,
  selectSushiLoading,
  selectSushiTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import SushiLiquidityPoolTable from './SushiLiquidityPoolTable';

type ISushiTableGroup = {
  page: 'profile' | 'bundle';
  currentChains: PortfolioChain[];
};

const SushiTableGroup = ({ page, currentChains }: ISushiTableGroup) => {
  const dispatch = useAppDispatch();

  const sushiTotal = useAppSelector(
    useCallback(page === 'profile' ? selectSushiTotal : selectBundleSushiTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectSushiLoading : selectBundleSushiLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileSushiError : selectBundleSushiError, [page])
  );

  const styledSushiTotal = useMemo(() => formatToMoney(sushiTotal), [sushiTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchSushiData());
    else dispatch(fetchBundleSushiData());
  }, [page, dispatch]);

  if ((!loading && sushiTotal === 0) || !isInCurrentChains('ETH', currentChains)) {
    return null;
  }

  return (
    <div id="sushi" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Sushi"
        totalValue={styledSushiTotal}
        tablePrimaryImgSrc="/img/icon/sushi.svg"
        tablePrimaryImgAlt="Sushi"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <SushiLiquidityPoolTable page={page} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default SushiTableGroup;
