import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectCheckerLoading } from '@app-src/store/checker/selectors';
import { Section } from '@app-src/store/checker/types';
import { useCallback } from 'react';
import PhamePointsTable from './PhamePointsTable';
import PhameTiersTable from './PhameTiersTable';
import PhameTransactionsTable from './PhameTransactionsTable';

type IPhameTableGroupProps = {
  section: Section;
};

const PhameTableGroup = ({ section }: IPhameTableGroupProps) => {
  const loading = useAppSelector(useCallback(selectCheckerLoading(section), [section]));

  return (
    <div className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Phame Points Checker"
        totalValue=""
        tablePrimaryImgSrc="/img/icon/phame.svg"
        tablePrimaryImgAlt="Phame Logo"
      />
      <PhameTransactionsTable loading={loading} section={section} />
      <PhameTiersTable loading={loading} section={section} />
      <PhamePointsTable loading={loading} section={section} />
    </div>
  );
};

export default PhameTableGroup;
