import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchSushiData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectSushiError,
  selectSushiLoading,
  selectSushiTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import SushiLiquidityPoolTable from './SushiLiquidityPoolTable';

type ISushiTableGroup = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const SushiTableGroup = ({ page, currentChains }: ISushiTableGroup) => {
  const dispatch = useAppDispatch();

  const sushiTotal = useAppSelector(useCallback(selectSushiTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectSushiLoading(page), [page]));
  const error = useAppSelector(useCallback(selectSushiError(page), [page]));

  const styledSushiTotal = useMemo(() => formatToMoney(sushiTotal), [sushiTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchSushiData(page)), [page, dispatch]);

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
