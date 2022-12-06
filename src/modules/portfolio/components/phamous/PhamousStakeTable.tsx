import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectPhamousComponentData } from '@app-src/store/portfolio/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import useSort from '../../hooks/useSort';
import { Portfolio } from '../../types/portfolio';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPhamousStakeTableProps = {
  page: Portfolio;
  loading: boolean;
};

const PhamousStakeTable = ({ page, loading }: IPhamousStakeTableProps) => {
  const phamousRewardData = useAppSelector(
    useCallback(selectPhamousComponentData('REWARD', page), [page])
  );
  const phamousStakingData = useAppSelector(
    useCallback(selectPhamousComponentData('STAKING', page), [page])
  );

  const [sortedPhamousRewardData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof phamousRewardData[number]
  >(phamousRewardData, 'usdValue', 'desc');

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

  if (phamousRewardData.length === 0 && phamousStakingData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staking</Bookmark>
      {phamousStakingData.length > 0 && (
        <>
          <TableHeaderRow>
            <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-1/2">USD Value</TableHeaderRowCell>
          </TableHeaderRow>
          {phamousStakingData.map((stake, index) => (
            <TableRow key={index}>
              <TableRowCell className="basis-1/4">
                <div className="flex flex-row gap-x-8">
                  <Image
                    className="rounded-full"
                    width="20px"
                    height="20px"
                    src={stake.image}
                    alt={stake.symbol}
                  />
                  <span>{stake.symbol}</span>
                </div>
              </TableRowCell>
              <TableRowCell className="basis-1/3">{styleNumber(stake.balance, 3)}</TableRowCell>
              <TableRowCell className="basis-1/2">{formatToMoney(stake.usdValue)}</TableRowCell>
            </TableRow>
          ))}
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
      {sortedPhamousRewardData.map((reward, index) => (
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
