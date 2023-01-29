import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhiatPoints } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';

type IPhiatPointsTableProps = {
  loading: boolean;
};

const PhiatPointsTable = ({ loading }: IPhiatPointsTableProps) => {
  const phiatPoints = useAppSelector(useCallback(selectPhiatPoints, []));

  if (loading) {
    return (
      <Card>
        <Bookmark>Points Summary</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="base-1/4">Phiat Points (Normal)</TableHeaderRowCell>
          <TableHeaderRowCell className="base-1/4">Phiat Points (Bonus)</TableHeaderRowCell>
          <TableHeaderRowCell className="base-1/4">ePhiat Points (Bonus)</TableHeaderRowCell>
          <TableHeaderRowCell className="base-1/4">Phame Points (Bonus)</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="base-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="base-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="base-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="base-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (phiatPoints.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Points Summary</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="base-1/4">Phiat Points (Normal)</TableHeaderRowCell>
        <TableHeaderRowCell className="base-1/4">Phiat Points (Bonus)</TableHeaderRowCell>
        <TableHeaderRowCell className="base-1/4">ePhiat Points (Bonus)</TableHeaderRowCell>
        <TableHeaderRowCell className="base-1/4">Phame Points (Bonus)</TableHeaderRowCell>
      </TableHeaderRow>
      {phiatPoints.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/6 pr-20">
            {transaction['Phiat Points (normal)']}
          </TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">
            {transaction['Phiat Points (bonus)']}
          </TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">
            {transaction['ePhiat Points (bonus)']}
          </TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">
            {transaction['Phame Points (Bonus)']}
          </TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhiatPointsTable;
