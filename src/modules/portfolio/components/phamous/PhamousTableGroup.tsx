import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchPhamousData } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfilePhamousError,
  selectProfilePhamousLoading,
  selectProfilePhamousTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import PhamousStakeTable from './PhamousStakeTable';

type IPhamousTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const PhamousTableGroup = ({ page, chain }: IPhamousTableGroupProps) => {
  const dispatch = useAppDispatch();

  const phamousTotal = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePhamousTotal : selectProfilePhamousTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePhamousLoading : selectProfilePhamousLoading, [
      page
    ])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePhamousError : selectProfilePhamousError, [page])
  );

  const styledPhamousTotal = useMemo(() => formatToMoney(phamousTotal), [phamousTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchPhamousData());
    // else dispatch(fetchBundlePhiatData());
  }, [page, dispatch]);

  if ((!loading && !error && phamousTotal === 0) || !isCurrentChain('TPLS', chain)) {
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
    </div>
  );
};

export default PhamousTableGroup;
