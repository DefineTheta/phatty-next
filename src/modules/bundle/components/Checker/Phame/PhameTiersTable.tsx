import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhameTiers } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';

type IPhameTiersTableProps = {
  loading: boolean;
};

const PhameTiersTable = ({ loading }: IPhameTiersTableProps) => {
  const phameTiers = useAppSelector(useCallback(selectPhameTiers, []));

  if (loading) {
    return (
      <Card>
        <Bookmark>Tiers</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/5">MagicM</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Phomo Tier</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">PoolA Tier0</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">PoolA Tier1</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">PoolA Tier2</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (phameTiers.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Tiers</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/5">MagicM</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Phomo Tier</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">PoolA Tier0</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">PoolA Tier1</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">PoolA Tier2</TableHeaderRowCell>
      </TableHeaderRow>
      {phameTiers.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/5 pr-20">{transaction.MagicM}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction.Phomo}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction.PoolATier0}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction.PoolATier1}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction.PoolATier2}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhameTiersTable;
