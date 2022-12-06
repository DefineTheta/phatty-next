import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchUniV3Data } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectUniV3Error,
  selectUniV3Loading,
  selectUniV3Total
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import UniV3LiquidityPoolTable from './UniV3LiquidityPoolTable';

type IUniV3TableGroup = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const UniV3TableGroup = ({ page, currentChains }: IUniV3TableGroup) => {
  const dispatch = useAppDispatch();

  const uniV3Total = useAppSelector(useCallback(selectUniV3Total(page), [page]));
  const loading = useAppSelector(useCallback(selectUniV3Loading(page), [page]));
  const error = useAppSelector(useCallback(selectUniV3Error(page), [page]));

  const styledUniV3Total = useMemo(() => formatToMoney(uniV3Total), [uniV3Total]);

  const fetchTableData = useCallback(() => dispatch(fetchUniV3Data(page)), [page, dispatch]);

  if ((!loading && uniV3Total === 0) || !isInCurrentChains('ETH', currentChains)) {
    return null;
  }

  return (
    <div id="univ3" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Uniswap V3"
        tableLink="https://app.uniswap.org/#/swap"
        totalValue={styledUniV3Total}
        tablePrimaryImgSrc="/img/icon/univ2.svg"
        tablePrimaryImgAlt="Uniswap V3"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <UniV3LiquidityPoolTable page={page} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default UniV3TableGroup;
