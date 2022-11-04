import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectBundleUniV2Loading, selectBundleUniV2Total } from '@app-src/store/bundles/selectors';
import { selectUniV2Loading, selectUniV2Total } from '@app-src/store/protocol/selectors';
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
  const uniV2Total = useAppSelector(
    useCallback(page === 'profile' ? selectUniV2Total : selectBundleUniV2Total, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectUniV2Loading : selectBundleUniV2Loading, [page])
  );

  const styledUniV2Total = useMemo(() => formatToMoney(uniV2Total), [uniV2Total]);

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
      <UniV2LiquidityPoolTable page={page} loading={loading} />
    </div>
  );
};

export default UniV2TableGroup;
