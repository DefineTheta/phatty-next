import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectCheckerLoading } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';
import PhamePointsTable from './PhamePointsTable';
import PhameTiersTable from './PhameTiersTable';
import PhameTransactionsTable from './PhameTransactionsTable';

const PhameTableGroup = () => {
  const loading = useAppSelector(useCallback(selectCheckerLoading, []));

  return (
    <div className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Phame Points Checker"
        totalValue=""
        tablePrimaryImgSrc="/img/icon/phame.svg"
        tablePrimaryImgAlt="Phame Logo"
      />
      <PhameTransactionsTable loading={loading} />
      <PhameTiersTable loading={loading} />
      <PhamePointsTable loading={loading} />
    </div>
  );
};

export default PhameTableGroup;
