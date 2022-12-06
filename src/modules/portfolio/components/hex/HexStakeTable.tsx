import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectHexStakeData } from '@app-src/store/portfolio/selectors';
import { HexDataComponentEnum } from '@app-src/store/protocol/types';
import { useCallback } from 'react';
import { PORTFOLIO_DATA_LIMIT } from '../../constants/data';
import useLimit from '../../hooks/useLimit';
import { Portfolio } from '../../types/portfolio';

type IHexStakeTableProps = {
  page: Portfolio;
  chain: keyof typeof HexDataComponentEnum;
  loading: boolean;
};

const HexStakeTable = ({ page, chain, loading }: IHexStakeTableProps) => {
  const hexStakeData = useAppSelector(useCallback(selectHexStakeData(page), [page, chain]));

  const [sortedHexStakeData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof hexStakeData[number]
  >(hexStakeData, 'usdValue', 'desc');

  const [limitedHexStakeData, isLimited, setIsLimited] = useLimit<
    typeof sortedHexStakeData[number]
  >(sortedHexStakeData, PORTFOLIO_DATA_LIMIT);

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

  if (hexStakeData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staked</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell
          className="basis-4/12 md:basis-1/5"
          onClick={() => handleTableHeaderClick('stakingEnd')}
          sorted={sortKey === 'stakingEnd' ? sortOrder : undefined}
          sortable
        >
          Staking End
        </TableHeaderRowCell>
        <TableHeaderRowCell className="hidden md:block md:basis-1/5">
          Total Balance
        </TableHeaderRowCell>
        <TableHeaderRowCell className="hidden md:block md:basis-1/5">
          Interest To Date
        </TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-6/12 md:basis-1/5"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortKey === 'usdValue' ? sortOrder : undefined}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-2/12 md:block md:basis-1/5">
          TShares
        </TableHeaderRowCell>
      </TableHeaderRow>
      {limitedHexStakeData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-4/12 md:basis-1/5">{`In ${item.stakingEnd} days`}</TableRowCell>
          <TableRowCell className="hidden md:block md:basis-1/5">
            {styleNumber(item.totalBalance, 3)}
          </TableRowCell>
          <TableRowCell className="hidden md:block md:basis-1/5">
            {formatToMoney(item.totalInt)}
          </TableRowCell>
          <TableRowCell className="basis-6/12 md:basis-1/5">
            {formatToMoney(item.usdValue)}
          </TableRowCell>
          <TableRowCell className="basis-2/12 md:block md:basis-1/5">
            {styleNumber(item.tShares, 2)}
          </TableRowCell>
        </TableRow>
      ))}
      {hexStakeData.length > PORTFOLIO_DATA_LIMIT && (
        <div className="mt-4 w-full text-center">
          <span className="text-md tracking-wide text-text-100">
            {isLimited
              ? `Only showing top ${PORTFOLIO_DATA_LIMIT} results.`
              : 'Showing all results.'}
            <a
              className="ml-4 cursor-pointer font-bold underline underline-offset-2"
              onClick={() => setIsLimited((current) => !current)}
            >
              {isLimited ? 'Show all?' : 'Show less?'}
            </a>
          </span>
        </div>
      )}
    </Card>
  );
};

export default HexStakeTable;
