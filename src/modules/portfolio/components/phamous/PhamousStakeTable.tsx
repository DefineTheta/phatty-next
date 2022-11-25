import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhamousPhameData, selectPhamousPhlpData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPhamousStakeTableProps = {
  page: 'profile' | 'bundle';
  loading: boolean;
};

const PhamousStakeTable = ({ page, loading }: IPhamousStakeTableProps) => {
  const phamousPhlpData = useAppSelector(
    useCallback(page === 'profile' ? selectPhamousPhlpData : selectPhamousPhlpData, [page])
  );
  const phamousPhameData = useAppSelector(
    useCallback(page === 'profile' ? selectPhamousPhameData : selectPhamousPhameData, [page])
  );

  const [sortedPhamousPhameRewardData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof phamousPhameData.rewards[number]
  >(phamousPhameData.rewards, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <Bookmark>Staking</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-2/5">USD Value</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-2/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Reward</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-2/5">USD Value</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-2/5 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (phamousPhlpData.balance === 0 && phamousPhameData.balance === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staking</Bookmark>
      {phamousPhlpData.balance > 0 && (
        <>
          <TableHeaderRow>
            <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-1/2">USD Value</TableHeaderRowCell>
          </TableHeaderRow>
          <TableRow>
            <TableRowCell className="basis-1/4">
              <div className="flex flex-row gap-x-8">
                <Image
                  className="rounded-full"
                  width="20px"
                  height="20px"
                  src={phamousPhlpData.image}
                  alt={phamousPhlpData.symbol}
                />
                <span>{phamousPhlpData.symbol}</span>
              </div>
            </TableRowCell>
            <TableRowCell className="basis-1/3">
              {styleNumber(phamousPhlpData.balance, 3)}
            </TableRowCell>
            <TableRowCell className="basis-1/2">
              {formatToMoney(phamousPhlpData.usdValue)}
            </TableRowCell>
          </TableRow>
        </>
      )}
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Reward</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/2"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPhamousPhameRewardData.map((reward, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={reward.image}
                alt={reward.symbol}
              />
              <span>{reward.symbol}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/3">{styleNumber(reward.balance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/2">{formatToMoney(reward.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhamousStakeTable;
