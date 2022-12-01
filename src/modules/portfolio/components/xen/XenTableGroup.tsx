import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundleXenData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleXenError,
  selectBundleXenLoading,
  selectBundleXenTotal
} from '@app-src/store/bundles/selectors';
import { fetchXenData } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfileXenError,
  selectProfileXenLoading,
  selectProfileXenTotal
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import XenMintTable from './XenMintTable';
import XenStakeTable from './XenStakeTable';

type IXenTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const XenTableGroup = ({ page, chain }: IXenTableGroupProps) => {
  const dispatch = useAppDispatch();

  const xenTotal = useAppSelector(
    useCallback(page === 'profile' ? selectProfileXenTotal : selectBundleXenTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectProfileXenLoading : selectBundleXenLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileXenError : selectBundleXenError, [page])
  );

  const styledXenTotal = useMemo(() => formatToMoney(xenTotal), [xenTotal]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchXenData());
    else dispatch(fetchBundleXenData());
  }, [page, dispatch]);

  if (!loading && !error && xenTotal === 0) {
    return null;
  }

  return (
    <div id="xen" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Xen"
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
