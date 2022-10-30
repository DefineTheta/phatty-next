import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectBundlePhiatLoading, selectBundlePhiatTotal } from '@app-src/store/bundles/selectors';
import { selectPhiatLoading, selectPhiatTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

type IPhiatTableGroupProps = {
  page: 'profile' | 'bundle';
};

const PhiatTableGroup = ({ page }: IPhiatTableGroupProps) => {
  const phiatTotal = useSelector(
    useCallback(page === 'profile' ? selectPhiatTotal : selectBundlePhiatTotal, [page])
  );
  const loading = useSelector(
    useCallback(page === 'profile' ? selectPhiatLoading : selectBundlePhiatLoading, [page])
  );

  const styledPhiatTotal = useMemo(() => formatToMoney(phiatTotal), [phiatTotal]);

  if (!loading && phiatTotal === 0) {
    return null;
  }

  return (
    <div id="phiat" className="w-full max-w-96 flex flex-col gap-y-24">
      <TableHeader
        tableName="Phiat.io"
        tableLink="https://testnet.phiat.io/markets"
        totalValue={styledPhiatTotal}
        tablePrimaryImgSrc="/img/tokens/phsac.png"
        tablePrimaryImgAlt="Phiat"
      />
      <PhiatStakeTable page={page} loading={loading} />
      <PhiatGenericTable page={page} component="LENDING" loading={loading} />
      <PhiatGenericTable page={page} component="VARIABLE_DEBT" loading={loading} />
      <PhiatGenericTable page={page} component="STABLE_DEBT" loading={loading} />
    </div>
  );
};

export default PhiatTableGroup;
