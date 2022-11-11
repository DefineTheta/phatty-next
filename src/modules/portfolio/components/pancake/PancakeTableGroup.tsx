import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundlePancakeData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundlePancakeError,
  selectBundlePancakeLoading,
  selectBundlePancakeTotal
} from '@app-src/store/bundles/selectors';
import { fetchPancakeData } from '@app-src/store/protocol/protocolSlice';
import {
  selectPancakeLoading,
  selectPancakeTotal,
  selectProfilePancakeError
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import PancakeFarmTable from './PancakeFarmTable';
import PancakeLiquidityPoolTable from './PancakeLiquidityPoolTable';

type IPancakeTableGroup = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const PancakeTableGroup = ({ page, chain }: IPancakeTableGroup) => {
  const dispatch = useAppDispatch();

  const pancakeTotal = useAppSelector(
    useCallback(page === 'profile' ? selectPancakeTotal : selectBundlePancakeTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectPancakeLoading : selectBundlePancakeLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePancakeError : selectBundlePancakeError, [page])
  );

  const styledPancakeTotal = useMemo(() => formatToMoney(pancakeTotal), [pancakeTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchPancakeData());
    else dispatch(fetchBundlePancakeData());
  }, [page, dispatch]);

  if ((!loading && pancakeTotal === 0) || !isCurrentChain('BSC', chain)) {
    return null;
  }

  return (
    <div id="pancake" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Pancake"
        tableLink="https://pancakeswap.finance"
        totalValue={styledPancakeTotal}
        tablePrimaryImgSrc="/img/icon/pancake.svg"
        tablePrimaryImgAlt="Pancake"
      />
      <div className="flex flex-col gap-y-24">
        <TableWrapper error={error} handleRetry={fetchTableData}>
          <PancakeLiquidityPoolTable page={page} loading={loading} />
        </TableWrapper>
        <TableWrapper error={error} handleRetry={fetchTableData}>
          <PancakeFarmTable page={page} loading={loading} />
        </TableWrapper>
      </div>
    </div>
  );
};

export default PancakeTableGroup;
