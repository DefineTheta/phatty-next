import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhiatTransactions } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';

type IPhiatTransactionsTableProps = {
  loading: boolean;
};

const PhiatTransactionsTable = ({ loading }: IPhiatTransactionsTableProps) => {
  const phiatTransactions = useAppSelector(useCallback(selectPhiatTransactions, []));

  if (loading) {
    return (
      <Card>
        <Bookmark>Transactions</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/6">Date</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">Token</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">Amount</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">Price</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">USD Value</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">Tier</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (phiatTransactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Transactions</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/6">Date</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Amount</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Price</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">USD Value</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Tier</TableHeaderRowCell>
      </TableHeaderRow>
      {phiatTransactions.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/6 pr-20">{transaction.Date}</TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">{transaction.Token}</TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">{transaction['Token Amount']}</TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">{transaction['Token Price']}</TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">{transaction['USD Value']}</TableRowCell>
          <TableRowCell className="basis-1/6 pr-20">{transaction.Tiers}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhiatTransactionsTable;