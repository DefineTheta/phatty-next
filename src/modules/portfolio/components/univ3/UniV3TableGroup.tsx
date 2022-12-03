import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundleUniV3Data } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleUniV3Error,
  selectBundleUniV3Loading,
  selectBundleUniV3Total
} from '@app-src/store/bundles/selectors';
import { fetchUniV3Data } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfileUniV3Error,
  selectUniV3Loading,
  selectUniV3Total
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import UniV3LiquidityPoolTable from './UniV3LiquidityPoolTable';

type IUniV3TableGroup = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const UniV3TableGroup = ({ page, chain }: IUniV3TableGroup) => {
  const dispatch = useAppDispatch();

  const uniV3Total = useAppSelector(
    useCallback(page === 'profile' ? selectUniV3Total : selectBundleUniV3Total, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectUniV3Loading : selectBundleUniV3Loading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileUniV3Error : selectBundleUniV3Error, [page])
  );

  const styledUniV3Total = useMemo(() => formatToMoney(uniV3Total), [uniV3Total]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchUniV3Data());
    else dispatch(fetchBundleUniV3Data());
  }, [page, dispatch]);

  if ((!loading && uniV3Total === 0) || !isCurrentChain('ETH', chain)) {
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
