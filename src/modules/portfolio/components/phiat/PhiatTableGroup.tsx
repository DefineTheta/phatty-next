import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchPhiatData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectPhamousLoading,
  selectPhiatError,
  selectPhiatTotal,
  selectPhiatTotalTSharesPercentage
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

type IPhiatTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const PhiatTableGroup = ({ page, currentChains }: IPhiatTableGroupProps) => {
  const dispatch = useAppDispatch();

  const phiatTotal = useAppSelector(useCallback(selectPhiatTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectPhamousLoading(page), [page]));
  const error = useAppSelector(useCallback(selectPhiatError(page), [page]));
  const phiatSeaCreature = useAppSelector(useCallback(selectPhiatTotalTSharesPercentage(page), []));

  const styledPhiatTotal = useMemo(
    () =>
      `${phiatSeaCreature.sum} ${phiatSeaCreature.name} ${phiatSeaCreature.icon} ${formatToMoney(
        phiatTotal
      )}`,
    [phiatTotal, phiatSeaCreature]
  );

  const fetchTableData = useCallback(() => dispatch(fetchPhiatData(page)), [page, dispatch]);

  if ((!loading && !error && phiatTotal === 0) || !isInCurrentChains('TPLS', currentChains)) {
    return null;
  }

  return (
    <div id="phiat" className="flex w-full max-w-96 flex-col gap-y-24">
      <TableHeader
        tableName="Phiat.io"
        tableLink="https://testnet.phiat.io/markets"
        totalValue={styledPhiatTotal}
        tablePrimaryImgSrc="/img/icon/phiat.png"
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
