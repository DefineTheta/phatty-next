import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectBundleSushiLoading, selectBundleSushiTotal } from '@app-src/store/bundles/selectors';
import { selectSushiLoading, selectSushiTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import SushiLiquidityPoolTable from './SushiLiquidityPoolTable';

type ISushiTableGroup = {
  page: 'profile' | 'bundle';
};

const SushiTableGroup = ({ page }: ISushiTableGroup) => {
  const sushiTotal = useSelector(
    useCallback(page === 'profile' ? selectSushiTotal : selectBundleSushiTotal, [page])
  );
  const loading = useSelector(
    useCallback(page === 'profile' ? selectSushiLoading : selectBundleSushiLoading, [page])
  );

  const styledSushiTotal = useMemo(() => formatToMoney(sushiTotal), [sushiTotal]);

  if (!loading && sushiTotal === 0) {
    return null;
  }

  return (
    <div id="sushi" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Sushi"
        totalValue={styledSushiTotal}
        tablePrimaryImgSrc="/img/icon/sushi.svg"
        tablePrimaryImgAlt="Sushi"
      />
      <SushiLiquidityPoolTable page={page} loading={loading} />
    </div>
  );
};

export default SushiTableGroup;
