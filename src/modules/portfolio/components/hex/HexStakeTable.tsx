import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectBundleHexStakeData } from '@app-src/store/bundles/selectors';
import { selectHexStakeData } from '@app-src/store/protocol/selectors';
import { HexDataComponentEnum } from '@app-src/store/protocol/types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

type IHexStakeTableProps = {
  page: 'profile' | 'bundle';
  chain: keyof typeof HexDataComponentEnum;
  loading: boolean;
};

const HexStakeTable = ({ page, chain, loading }: IHexStakeTableProps) => {
  const hexStakeData = useSelector(
    useCallback(page === 'profile' ? selectHexStakeData(chain) : selectBundleHexStakeData(chain), [
      page,
      chain
    ])
  );

  const [sortedHexStakeData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof hexStakeData[number]
  >(hexStakeData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/5">Staking End</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Total Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Interest To Date</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">USD Value</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">TShares</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="pr-20 basis-1/5">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/5">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/5">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/5">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/5">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (sortedHexStakeData.length === 0) {
    return null;
  }

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell
          className="basis-1/5"
          onClick={() => handleTableHeaderClick('stakingEnd')}
          sorted={sortKey === 'stakingEnd' ? sortOrder : undefined}
          sortable
        >
          Staking End
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Total Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Interest To Date</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/5"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortKey === 'usdValue' ? sortOrder : undefined}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">TShares</TableHeaderRowCell>
      </TableHeaderRow>
      {sortedHexStakeData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/5">{`In ${item.stakingEnd} days`}</TableRowCell>
          <TableRowCell className="basis-1/5">{styleNumber(item.totalBalance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.totalInt)}</TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.usdValue)}</TableRowCell>
          <TableRowCell className="basis-1/5">{styleNumber(item.tShares, 2)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default HexStakeTable;
