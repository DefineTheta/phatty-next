import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectPhiatTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

const PhiatTableGroup = () => {
  const phiatTotal = useSelector(useCallback(selectPhiatTotal, []));

  const styledPhiatTotal = useMemo(() => formatToMoney(phiatTotal), [phiatTotal]);

  return (
    <div id="#phiat" className="w-full max-w-96 flex flex-col gap-y-24">
      <TableHeader
        tableName="Phiat.io"
        tableLink="https://testnet.phiat.io/markets"
        totalValue={styledPhiatTotal}
        tablePrimaryImgSrc="/img/tokens/phsac.png"
        tablePrimaryImgAlt="Phiat"
      />
      <PhiatStakeTable />
      <PhiatGenericTable component="LENDING" />
      <PhiatGenericTable component="VARIABLE_DEBT" />
      <PhiatGenericTable component="STABLE_DEBT" />
    </div>
  );
};

export default PhiatTableGroup;
