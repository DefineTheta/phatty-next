import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundlePulsexData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundlePulsexError,
  selectBundlePulsexLoading,
  selectBundlePulsexTotal
} from '@app-src/store/bundles/selectors';
import { fetchPulsexData } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfilePulsexError,
  selectPulsexLoading,
  selectPulsexTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import PulsexLiquidityPoolTable from './PulsexLiquidityPoolTable';

type IPulsexTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const PulsexTableGroup = ({ page, chain }: IPulsexTableGroupProps) => {
  const dispatch = useAppDispatch();

  const pulsexTotal = useAppSelector(
    useCallback(page === 'profile' ? selectPulsexTotal : selectBundlePulsexTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectPulsexLoading : selectBundlePulsexLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePulsexError : selectBundlePulsexError, [page])
  );

  const styledPulsexTotal = useMemo(() => formatToMoney(pulsexTotal), [pulsexTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchPulsexData());
    else dispatch(fetchBundlePulsexData());
  }, [page, dispatch]);

  if ((!loading && !error && pulsexTotal === 0) || !isCurrentChain('TPLS', chain)) {
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
