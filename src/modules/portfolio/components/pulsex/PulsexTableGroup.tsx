import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectPulsexLoading, selectPulsexTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PulsexLiquidityPoolTable from './PulsexLiquidityPoolTable';

const PulsexTableGroup = () => {
  const pulsexTotal = useSelector(useCallback(selectPulsexTotal, []));
  const loading = useSelector(useCallback(selectPulsexLoading, []));

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
      <PulsexLiquidityPoolTable loading={loading} />
    </div>
  );
};

export default PulsexTableGroup;
