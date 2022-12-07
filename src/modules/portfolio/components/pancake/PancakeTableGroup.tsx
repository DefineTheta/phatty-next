import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchPancakeData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectPancakeError,
  selectPancakeLoading,
  selectPancakeTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import PancakeFarmTable from './PancakeFarmTable';
import PancakeLiquidityPoolTable from './PancakeLiquidityPoolTable';

type IPancakeTableGroup = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const PancakeTableGroup = ({ page, currentChains }: IPancakeTableGroup) => {
  const dispatch = useAppDispatch();

  const pancakeTotal = useAppSelector(useCallback(selectPancakeTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectPancakeLoading(page), [page]));
  const error = useAppSelector(useCallback(selectPancakeError(page), [page]));

  const styledPancakeTotal = useMemo(() => formatToMoney(pancakeTotal), [pancakeTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchPancakeData(page)), [page, dispatch]);

  if ((!loading && pancakeTotal === 0) || !isInCurrentChains('BSC', currentChains)) {
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
