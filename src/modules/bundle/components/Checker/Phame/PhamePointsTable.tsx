import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhamePoints } from '@app-src/store/checker/selectors';
import { Section } from '@app-src/store/checker/types';
import { useCallback } from 'react';

type IPhamePointsTableProps = {
  loading: boolean;
  section: Section;
};

const PhamePointsTable = ({ loading, section }: IPhamePointsTableProps) => {
  const phamePoints = useAppSelector(useCallback(selectPhamePoints(section), [section]));

  if (loading) {
    return (
      <Card>
        <Bookmark>Points Summary</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Phame Points (Normal)</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Phame Points (Volume Bonus)</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">
            Phame Points (Loyalty Bonus)
          </TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">ePhiat Points</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  return (
    <Card>
      <Bookmark>Points Summary</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Phame Points (Normal)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Phame Points (Volume Bonus)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Phame Points (Loyalty Bonus)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">ePhiat Points</TableHeaderRowCell>
      </TableHeaderRow>
      {phamePoints.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4 pr-20">
            {transaction['Phame Points (Normal)']}
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">
            {transaction['Phame Points (Volume Bonus)']}
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">
            {transaction['Phame Points (Loyalty Bonus)']}
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">
            {transaction['ePhiat Points (Bonus)']}
          </TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhamePointsTable;
