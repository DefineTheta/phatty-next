import TableHeader from '@app-src/common/components/table/TableHeader';
import {
  selectBundlePulsexLoading,
  selectBundlePulsexTotal
} from '@app-src/store/bundles/selectors';
import { selectPulsexLoading, selectPulsexTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PulsexLiquidityPoolTable from './PulsexLiquidityPoolTable';

type IPulsexTableGroupProps = {
  page: 'profile' | 'bundle';
};

const PulsexTableGroup = ({ page }: IPulsexTableGroupProps) => {
  const pulsexTotal = useSelector(
    useCallback(page === 'profile' ? selectPulsexTotal : selectBundlePulsexTotal, [page])
  );
  const loading = useSelector(
    useCallback(page === 'profile' ? selectPulsexLoading : selectBundlePulsexLoading, [page])
  );

  const styledPulsexTotal = useMemo(() => formatToMoney(pulsexTotal), [pulsexTotal]);

  if (!loading && pulsexTotal === 0) {
    return null;
  }

  return (
    <div id="#pulsex" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Pulsex"
        tableLink="https://app.v2b.testnet.pulsex.com/swap"
        totalValue={styledPulsexTotal}
        tablePrimaryImgSrc="/img/tokens/pulsex.jpeg"
        tablePrimaryImgAlt="Pulsex"
      />
      <PulsexLiquidityPoolTable page={page} loading={loading} />
    </div>
  );
};

export default PulsexTableGroup;
