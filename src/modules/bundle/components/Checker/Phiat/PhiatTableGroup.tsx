import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectCheckerLoading } from '@app-src/store/checker/selectors';
import { Section } from '@app-src/store/checker/types';
import { useCallback } from 'react';
import PhiatPointsTable from './PhiatPointsTable';
import PhiatTransactionsTable from './PhiatTransactionsTable';

type IPhiatTableGroupProps = {
  section: Section;
};

const PhiatTableGroup = ({ section }: IPhiatTableGroupProps) => {
  const loading = useAppSelector(useCallback(selectCheckerLoading(section), [section]));

  return (
    <div className="flex w-full max-w-96 flex-col gap-y-12">
      <TableHeader
        tableName="Phiat Points Checker"
        totalValue=""
        tablePrimaryImgSrc="/img/icon/phiat.png"
        tablePrimaryImgAlt="Phiat Logo"
      />
      <PhiatTransactionsTable loading={loading} section={section} />
      <PhiatPointsTable loading={loading} section={section} />
    </div>
  );
};

export default PhiatTableGroup;
