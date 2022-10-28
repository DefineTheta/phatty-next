import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectPancakeTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PancakeFarmTable from './PancakeFarmTable';
import PancakeLiquidityPoolTable from './PancakeLiquidityPoolTable';

const PancakeTableGroup = () => {
  const pancakeTotal = useSelector(useCallback(selectPancakeTotal, []));

  const styledPancakeTotal = useMemo(() => formatToMoney(pancakeTotal), [pancakeTotal]);

  return (
    <div id="#pancake" className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableName="Pancake"
        tableLink="https://pancakeswap.finance"
        totalValue={styledPancakeTotal}
        tablePrimaryImgSrc="/img/icon/pancake.svg"
        tablePrimaryImgAlt="Pancake"
      />
      <div className="flex flex-col gap-y-24">
        <PancakeLiquidityPoolTable />
        <PancakeFarmTable />
      </div>
    </div>
  );
};

export default PancakeTableGroup;
