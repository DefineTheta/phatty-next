import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchPulsexData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectPulsexError,
  selectPulsexLoading,
  selectPulsexTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import PulsexLiquidityPoolTable from './PulsexLiquidityPoolTable';

type IPulsexTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const PulsexTableGroup = ({ page, currentChains }: IPulsexTableGroupProps) => {
  const dispatch = useAppDispatch();

  const pulsexTotal = useAppSelector(useCallback(selectPulsexTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectPulsexLoading(page), [page]));
  const error = useAppSelector(useCallback(selectPulsexError(page), [page]));

  const styledPulsexTotal = useMemo(() => formatToMoney(pulsexTotal), [pulsexTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchPulsexData(page)), [page, dispatch]);

  if ((!loading && !error && pulsexTotal === 0) || !isInCurrentChains('TPLS', currentChains)) {
    return null;
  }

  return (
    <div id="pulsex" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Pulsex"
        tableLink="https://app.v2b.testnet.pulsex.com/swap"
        totalValue={styledPulsexTotal}
        tablePrimaryImgSrc="/img/tokens/pulsex.jpeg"
        tablePrimaryImgAlt="Pulsex"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PulsexLiquidityPoolTable page={page} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default PulsexTableGroup;
