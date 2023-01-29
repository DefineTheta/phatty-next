import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectCheckerLoading } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';
import PhiatPointsTable from './PhiatPointsTable';
import PhiatTransactionsTable from './PhiatTransactionsTable';

const PhiatTableGroup = () => {
  const loading = useAppSelector(useCallback(selectCheckerLoading, []));

  return (
    <div className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Phiat Points Checker"
        totalValue=""
        tablePrimaryImgSrc="/img/icon/phiat.png"
        tablePrimaryImgAlt="Phiat Logo"
      />
      <PhiatTransactionsTable loading={loading} />
      <PhiatPointsTable loading={loading} />
    </div>
  );
};

export default PhiatTableGroup;
