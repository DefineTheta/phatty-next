import TableHeader from '@app-src/common/components/table/TableHeader';
import {
  selectBundlePancakeLoading,
  selectBundlePancakeTotal
} from '@app-src/store/bundles/selectors';
import { selectPancakeLoading, selectPancakeTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PancakeFarmTable from './PancakeFarmTable';
import PancakeLiquidityPoolTable from './PancakeLiquidityPoolTable';

type IPancakeTableGroup = {
  page: 'profile' | 'bundle';
};

const PancakeTableGroup = ({ page }: IPancakeTableGroup) => {
  const pancakeTotal = useSelector(
    useCallback(page === 'profile' ? selectPancakeTotal : selectBundlePancakeTotal, [page])
  );
  const loading = useSelector(
    useCallback(page === 'profile' ? selectPancakeLoading : selectBundlePancakeLoading, [page])
  );

  const styledPancakeTotal = useMemo(() => formatToMoney(pancakeTotal), [pancakeTotal]);

  if (!loading && pancakeTotal === 0) {
    return null;
  }

  return (
    <div id="pancake" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Pancake"
        tableLink="https://pancakeswap.finance"
        totalValue={styledPancakeTotal}
        tablePrimaryImgSrc="/img/icon/pancake.svg"
        tablePrimaryImgAlt="Pancake"
      />
      <div className="flex flex-col gap-y-24">
        <PancakeLiquidityPoolTable page={page} loading={loading} />
        <PancakeFarmTable page={page} loading={loading} />
      </div>
    </div>
  );
};

export default PancakeTableGroup;
