import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhameTransactions } from '@app-src/store/checker/selectors';
import { useCallback } from 'react';

type IPhameTransactionsTableProps = {
  loading: boolean;
};

const PhameTransactionsTable = ({ loading }: IPhameTransactionsTableProps) => {
  const phameTransactions = useAppSelector(useCallback(selectPhameTransactions, []));

  if (loading) {
    return (
      <Card>
        <Bookmark>Transactions</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/5">Date</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Token</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Amount</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Price</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">USD Value</TableHeaderRowCell>
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

  return (
    <Card>
      <Bookmark>Transactions</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/5">Date</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Amount</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Price</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">USD Value</TableHeaderRowCell>
      </TableHeaderRow>
      {phameTransactions.map((transaction, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/5 pr-20">{transaction.DateTime}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction.Token}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction['Token Amount']}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction['Token Price']}</TableRowCell>
          <TableRowCell className="basis-1/5 pr-20">{transaction['USD Value']}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhameTransactionsTable;
