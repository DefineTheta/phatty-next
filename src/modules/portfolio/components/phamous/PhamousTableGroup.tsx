import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchPhamousData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectPhamousError,
  selectPhamousLoading,
  selectPhamousTotal,
  selectPhamousTotalTSharesPercentage
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import PhamousLiquidityTable from './PhamousLiquidityTable';
import PhamousStakeTable from './PhamousStakeTable';

type IPhamousTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const PhamousTableGroup = ({ page, currentChains }: IPhamousTableGroupProps) => {
  const dispatch = useAppDispatch();

  const phamousTotal = useAppSelector(useCallback(selectPhamousTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectPhamousLoading(page), [page]));
  const error = useAppSelector(useCallback(selectPhamousError(page), [page]));
  const phamousSeaCreature = useAppSelector(
    useCallback(selectPhamousTotalTSharesPercentage(page), [page])
  );

  const styledPhamousTotal = useMemo(
    () =>
      `${phamousSeaCreature.sum} ${phamousSeaCreature.name} ${
        phamousSeaCreature.icon
      } ${formatToMoney(phamousTotal)}`,
    [phamousTotal, phamousSeaCreature]
  );

  const fetchTableData = useCallback(() => dispatch(fetchPhamousData(page)), [page, dispatch]);

  if ((!loading && !error && phamousTotal === 0) || !isInCurrentChains('TPLS', currentChains)) {
    return null;
  }

  return (
    <div id="phamous" className="flex w-full max-w-96 flex-col gap-y-24">
      <TableHeader
        tableName="Phamous"
        tableLink="https://phamous.io/"
        totalValue={styledPhamousTotal}
        tablePrimaryImgSrc="/img/icon/phamous_table.svg"
        tablePrimaryImgAlt="Phamous"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhamousStakeTable page={page} loading={loading} />
      </TableWrapper>
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhamousLiquidityTable page={page} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default PhamousTableGroup;
