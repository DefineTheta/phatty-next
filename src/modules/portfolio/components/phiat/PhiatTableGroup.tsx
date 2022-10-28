import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectPhiatLoading, selectPhiatTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

const PhiatTableGroup = () => {
  const phiatTotal = useSelector(useCallback(selectPhiatTotal, []));
  const loading = useSelector(useCallback(selectPhiatLoading, []));

  const styledPhiatTotal = useMemo(() => formatToMoney(phiatTotal), [phiatTotal]);

  if (!loading && phiatTotal === 0) {
    return null;
  }

  return (
    <div id="#phiat" className="w-full max-w-96 flex flex-col gap-y-24">
      <TableHeader
        tableName="Phiat.io"
        tableLink="https://testnet.phiat.io/markets"
        totalValue={styledPhiatTotal}
        tablePrimaryImgSrc="/img/tokens/phsac.png"
        tablePrimaryImgAlt="Phiat"
      />
      <PhiatStakeTable loading={loading} />
      <PhiatGenericTable component="LENDING" loading={loading} />
      <PhiatGenericTable component="VARIABLE_DEBT" loading={loading} />
      <PhiatGenericTable component="STABLE_DEBT" loading={loading} />
    </div>
  );
};

export default PhiatTableGroup;
