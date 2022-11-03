import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectBundleUniV3Loading, selectBundleUniV3Total } from '@app-src/store/bundles/selectors';
import { selectUniV3Loading, selectUniV3Total } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { formatToMoney } from '../../utils/format';
import UniV3LiquidityPoolTable from './UniV3LiquidityPoolTable';

type IUniV3TableGroup = {
  page: 'profile' | 'bundle';
};

const UniV3TableGroup = ({ page }: IUniV3TableGroup) => {
  const uniV3Total = useAppSelector(
    useCallback(page === 'profile' ? selectUniV3Total : selectBundleUniV3Total, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectUniV3Loading : selectBundleUniV3Loading, [page])
  );

  const styledUniV3Total = useMemo(() => formatToMoney(uniV3Total), [uniV3Total]);

  if (!loading && uniV3Total === 0) {
    return null;
  }

  return (
    <div id="uniV3" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Uniswap V3"
        totalValue={styledUniV3Total}
        tablePrimaryImgSrc="/img/icon/uniV2.svg"
        tablePrimaryImgAlt="Uniswap V3"
      />
      <UniV3LiquidityPoolTable page={page} loading={loading} />
    </div>
  );
};

export default UniV3TableGroup;
