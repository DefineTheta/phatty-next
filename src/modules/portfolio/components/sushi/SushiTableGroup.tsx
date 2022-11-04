import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectBundleSushiLoading, selectBundleSushiTotal } from '@app-src/store/bundles/selectors';
import { selectSushiLoading, selectSushiTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import SushiLiquidityPoolTable from './SushiLiquidityPoolTable';

type ISushiTableGroup = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const SushiTableGroup = ({ page, chain }: ISushiTableGroup) => {
  const sushiTotal = useAppSelector(
    useCallback(page === 'profile' ? selectSushiTotal : selectBundleSushiTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectSushiLoading : selectBundleSushiLoading, [page])
  );

  const styledSushiTotal = useMemo(() => formatToMoney(sushiTotal), [sushiTotal]);

  if ((!loading && sushiTotal === 0) || !isCurrentChain('ETH', chain)) {
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
