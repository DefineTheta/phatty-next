import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectPulsexTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PulsexLiquidityPoolTable from './PulsexLiquidityPoolTable';

const PulsexTableGroup = () => {
  const pulsexTotal = useSelector(useCallback(selectPulsexTotal, []));

  const styledPulsexTotal = useMemo(() => formatToMoney(pulsexTotal), [pulsexTotal]);

  return (
    <div id="#pulsex" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Pulsex"
        tableLink="https://app.v2b.testnet.pulsex.com/swap"
        totalValue={styledPulsexTotal}
        tablePrimaryImgSrc="/img/tokens/pulsex.jpeg"
        tablePrimaryImgAlt="Pulsex"
      />
      <PulsexLiquidityPoolTable />
    </div>
  );
};

export default PulsexTableGroup;
