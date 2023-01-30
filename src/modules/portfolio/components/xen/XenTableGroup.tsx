import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchXenData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectXenError,
  selectXenLoading,
  selectXenTotal
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { filterCurrentChains } from '../../utils/misc';
import XenMintTable from './XenMintTable';
import XenStakeTable from './XenStakeTable';

type IXenTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const XenTableGroup = ({ page, currentChains }: IXenTableGroupProps) => {
  const dispatch = useAppDispatch();

  const xenTotal = useAppSelector(
    useCallback(
      selectXenTotal(
        filterCurrentChains(['ETH', 'BSC', 'AVAX', 'FTM', 'MATIC'], currentChains),
        page
      ),
      [page, currentChains]
    )
  );
  const loading = useAppSelector(useCallback(selectXenLoading(page), [page]));
  const error = useAppSelector(useCallback(selectXenError(page), [page]));

  const styledXenTotal = useMemo(() => formatToMoney(xenTotal), [xenTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchXenData(page)), [page, dispatch]);

  if (!loading && !error && xenTotal === 0) {
    return null;
  }

  return (
    <div id="xen" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Xen"
        tableLink="https://xen.network/"
        totalValue={styledXenTotal}
        tablePrimaryImgSrc="/img/icon/xen.png"
        tablePrimaryImgAlt="Xen"
      />
      <div className="flex flex-col gap-y-24">
        <TableWrapper error={error} handleRetry={fetchTableData}>
          <XenStakeTable page={page} loading={loading} />
        </TableWrapper>
        <TableWrapper error={error} handleRetry={fetchTableData}>
          <XenMintTable page={page} loading={loading} />
        </TableWrapper>
      </div>
    </div>
  );
};

export default XenTableGroup;
