import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectHedronStakeData } from '@app-src/store/portfolio/selectors';
import { HedronDataComponentEnum } from '@app-src/store/protocol/types';
import { useCallback } from 'react';
import useSort from '../../hooks/useSort';
import { Portfolio } from '../../types/portfolio';
import { formatToMoney, styleNumber } from '../../utils/format';

type IHedronStakeTableProps = {
  page: Portfolio;
  chain: keyof typeof HedronDataComponentEnum;
  loading: boolean;
};

const HedronStakeTable = ({ page, chain, loading }: IHedronStakeTableProps) => {
  const hedronStakeData = useAppSelector(
    useCallback(selectHedronStakeData(chain, page), [chain, page])
  );

  const [sortedHedronStakeData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof hedronStakeData[number]
  >(hedronStakeData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <Bookmark>Staked</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/5">Staking End</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Total Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Interest To Date</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">USD Value</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">TShares</TableHeaderRowCell>
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

  if (sortedHedronStakeData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staked</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/6">Stake Type</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/6"
          onClick={() => handleTableHeaderClick('stakingEnd')}
          sorted={sortKey === 'stakingEnd' ? sortOrder : undefined}
          sortable
        >
          Served Days
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Staked Hex</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Hedron Mintable</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/6"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortKey === 'usdValue' ? sortOrder : undefined}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">TShares</TableHeaderRowCell>
      </TableHeaderRow>
      {sortedHedronStakeData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/6">{item.stakeType}</TableRowCell>
          <TableRowCell className="basis-1/6">{`${item.servedDays} days`}</TableRowCell>
          <TableRowCell className="basis-1/6">{styleNumber(item.hexStaked, 3)}</TableRowCell>
          <TableRowCell className="basis-1/6">{styleNumber(item.hedronMintable, 3)}</TableRowCell>
          <TableRowCell className="basis-1/6">{formatToMoney(item.usdValue)}</TableRowCell>
          <TableRowCell className="basis-1/6">{styleNumber(item.tShares, 2)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default HedronStakeTable;
