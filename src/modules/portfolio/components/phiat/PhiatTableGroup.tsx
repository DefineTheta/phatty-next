import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectBundlePhiatLoading, selectBundlePhiatTotal } from '@app-src/store/bundles/selectors';
import {
  selectPhiatLoading,
  selectPhiatTotal,
  selectPhiatTotalTSharesPercentage
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { PortfolioChain } from '../../types/portfolio';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain } from '../../utils/misc';
import PhiatGenericTable from './PhiatGenericTable';
import PhiatStakeTable from './PhiatStakeTable';

type IPhiatTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const PhiatTableGroup = ({ page, chain }: IPhiatTableGroupProps) => {
  const phiatTotal = useAppSelector(
    useCallback(page === 'profile' ? selectPhiatTotal : selectBundlePhiatTotal, [page])
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectPhiatLoading : selectBundlePhiatLoading, [page])
  );
  const phiatSeaCreature = useAppSelector(useCallback(selectPhiatTotalTSharesPercentage, []));

  const styledPhiatTotal = useMemo(
    () =>
      `${phiatSeaCreature.sum} ${phiatSeaCreature.name} ${phiatSeaCreature.icon} ${formatToMoney(
        phiatTotal
      )}`,
    [phiatTotal, phiatSeaCreature]
  );

  if ((!loading && phiatTotal === 0) || !isCurrentChain('TPLS', chain)) {
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
