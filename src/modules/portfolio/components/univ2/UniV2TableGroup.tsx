import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { fetchBundleUniV2Data } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleUniV2Error,
  selectBundleUniV2Loading,
  selectBundleUniV2Total
} from '@app-src/store/bundles/selectors';
import { fetchUniV2Data } from '@app-src/store/protocol/protocolSlice';
import {
  selectProfileUniV2Error,
  selectUniV2Loading,
  selectUniV2Total
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import UniV2LiquidityPoolTable from './UniV2LiquidityPoolTable';

type IUniV2TableGroup = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const UniV2TableGroup = ({ page, chain }: IUniV2TableGroup) => {
  const dispatch = useAppDispatch();

  const uniV2Total = useAppSelector(
    useCallback(page === 'profile' ? selectUniV2Total : selectBundleUniV2Total, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectUniV2Loading : selectBundleUniV2Loading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileUniV2Error : selectBundleUniV2Error, [page])
  );

  const styledUniV2Total = useMemo(() => formatToMoney(uniV2Total), [uniV2Total]);

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchUniV2Data());
    else dispatch(fetchBundleUniV2Data());
  }, [page, dispatch]);

  if ((!loading && uniV2Total === 0) || !isCurrentChain('ETH', chain)) {
    return null;
  }

  return (
    <div id="univ2" className="w-full max-w-96 flex flex-col gap-y-12">
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
