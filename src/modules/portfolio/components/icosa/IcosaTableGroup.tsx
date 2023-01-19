import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchIcosaData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectIcosaError,
  selectIcosaLoading,
  selectIcosaTotal
} from '@app-src/store/portfolio/selectors';
import { Portfolio } from '@app-src/store/portfolio/types';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import IcosaStakeTable from './IcosaStakeTable';

type IIcosaTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const IcosaTableGroup = ({ page, currentChains }: IIcosaTableGroupProps) => {
  const dispatch = useAppDispatch();

  const icosaTotal = useAppSelector(useCallback(selectIcosaTotal(page), [page]));
  const loading = useAppSelector(useCallback(selectIcosaLoading(page), [page]));
  const error = useAppSelector(useCallback(selectIcosaError(page), [page]));

  const styledIcosaTotal = useMemo(() => formatToMoney(icosaTotal), [icosaTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchIcosaData(page)), [page, dispatch]);

  if ((!loading && !error && icosaTotal === 0) || !isInCurrentChains(['ETH'], currentChains)) {
    return null;
  }

  return (
    <div id="icosa" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Icosa"
        tableLink="https://app.icosa.pro/apps/icosa"
        totalValue={styledIcosaTotal}
        tablePrimaryImgSrc="/img/icon/icosa.png"
        tablePrimaryImgAlt="Icosa"
      />
      <div className="flex flex-col gap-y-24">
        <TableWrapper error={error} handleRetry={fetchTableData}>
          <IcosaStakeTable page={page} loading={loading} />
        </TableWrapper>
      </div>
    </div>
  );
};

export default IcosaTableGroup;
