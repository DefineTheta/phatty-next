import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchUniV2Data } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectUniV2Error,
  selectUniV2Loading,
  selectUniV2Total
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { Portfolio, PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import UniV2LiquidityPoolTable from './UniV2LiquidityPoolTable';

type IUniV2TableGroup = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const UniV2TableGroup = ({ page, currentChains }: IUniV2TableGroup) => {
  const dispatch = useAppDispatch();

  const uniV2Total = useAppSelector(useCallback(selectUniV2Total(page), [page]));
  const loading = useAppSelector(useCallback(selectUniV2Loading(page), [page]));
  const error = useAppSelector(useCallback(selectUniV2Error(page), [page]));

  const styledUniV2Total = useMemo(() => formatToMoney(uniV2Total), [uniV2Total]);

  const fetchTableData = useCallback(() => dispatch(fetchUniV2Data(page)), [page, dispatch]);

  if ((!loading && uniV2Total === 0) || !isInCurrentChains('ETH', currentChains)) {
    return null;
  }

  return (
    <div id="univ2" className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Uniswap V2"
        totalValue={styledUniV2Total}
        tablePrimaryImgSrc="/img/icon/univ2.svg"
        tablePrimaryImgAlt="Uniswap V2"
      />
      <TableWrapper error={error} handleRetry={fetchTableData}>
        <UniV2LiquidityPoolTable page={page} loading={loading} />
      </TableWrapper>
    </div>
  );
};

export default UniV2TableGroup;
