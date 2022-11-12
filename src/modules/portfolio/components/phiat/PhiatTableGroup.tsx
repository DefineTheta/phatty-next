import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundlePhiatData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundlePhiatError,
  selectBundlePhiatLoading,
  selectBundlePhiatTotal,
  selectBundlePhiatTotalTSharesPercentage
} from '@app-src/store/bundles/selectors';
import { fetchPhiatData } from '@app-src/store/protocol/protocolSlice';
import {
  selectPhiatLoading,
  selectPhiatTotal,
  selectPhiatTotalTSharesPercentage,
  selectProfilePhiatError
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

type IPhiatTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const PhiatTableGroup = ({ page, chain }: IPhiatTableGroupProps) => {
  const dispatch = useAppDispatch();

  const phiatTotal = useAppSelector(
    useCallback(page === 'profile' ? selectPhiatTotal : selectBundlePhiatTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectPhiatLoading : selectBundlePhiatLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfilePhiatError : selectBundlePhiatError, [page])
  );
  const phiatSeaCreature = useAppSelector(
    useCallback(
      page === 'profile'
        ? selectPhiatTotalTSharesPercentage
        : selectBundlePhiatTotalTSharesPercentage,
      []
    )
  );

  const styledPhiatTotal = useMemo(
    () =>
      `${phiatSeaCreature.sum} ${phiatSeaCreature.name} ${phiatSeaCreature.icon} ${formatToMoney(
        phiatTotal
      )}`,
    [phiatTotal, phiatSeaCreature]
  );

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchPhiatData());
    else dispatch(fetchBundlePhiatData());
  }, [page, dispatch]);

  if ((!loading && !error && phiatTotal === 0) || !isCurrentChain('TPLS', chain)) {
    return null;
  }

  return (
    <div id="phiat" className="flex w-full max-w-96 flex-col gap-y-24">
      <TableHeader
        tableName="Phiat.io"
        tableLink="https://testnet.phiat.io/markets"
        totalValue={styledPhiatTotal}
        tablePrimaryImgSrc="/img/tokens/phsac.png"
        tablePrimaryImgAlt="Phiat"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhiatStakeTable page={page} loading={loading} />
      </TableWrapper>
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhiatGenericTable bookmark="Lending" page={page} component="LENDING" loading={loading} />
      </TableWrapper>
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhiatGenericTable
          bookmark="Variable Debt"
          page={page}
          component="VARIABLE_DEBT"
          loading={loading}
        />
      </TableWrapper>
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <PhiatGenericTable
          bookmark="Stable Debt"
          page={page}
          component="STABLE_DEBT"
          loading={loading}
        />
      </TableWrapper>
    </div>
  );
};

export default PhiatTableGroup;
