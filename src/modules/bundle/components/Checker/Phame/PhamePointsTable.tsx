import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhamePoints } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';

type IPhamePointsTableProps = {
  loading: boolean;
};

const PhamePointsTable = ({ loading }: IPhamePointsTableProps) => {
  const phamePoints = useAppSelector(useCallback(selectPhamePoints, []));

  if (loading) {
    return (
      <Card>
        <Bookmark>Points Summary</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/3">Phame Points (Normal)</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">Phame Points (Volume Bonus)</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">ePhiat Points</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (phamePoints.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Points Summary</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/3">Phame Points (Normal)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Phame Points (Volume Bonus)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">ePhiat Points</TableHeaderRowCell>
      </TableHeaderRow>
      {phamePoints.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/3 pr-20">
            {transaction['Phame Points (Normal)']}
          </TableRowCell>
          <TableRowCell className="basis-1/3 pr-20">
            {transaction['Phame Points (Volume Bonus)']}
          </TableRowCell>
          <TableRowCell className="basis-1/3 pr-20">
            {transaction['ePhiat Points (Bonus)']}
          </TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhamePointsTable;
