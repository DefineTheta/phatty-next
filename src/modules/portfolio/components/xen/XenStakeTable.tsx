import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectBundleXenComponentData } from '@app-src/store/bundles/selectors';
import { selectProfileXenComponentData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

type IXenStakeTableProps = {
  page: 'profile' | 'bundle';
  loading: boolean;
};

const XenStakeTable = ({ page, loading }: IXenStakeTableProps) => {
  const xenStakingData = useAppSelector(
    useCallback(
      page === 'profile'
        ? selectProfileXenComponentData('STAKING')
        : selectBundleXenComponentData('STAKING'),
      [page]
    )
  );

  const [sortedXenStakingData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof xenStakingData[number]
  >(xenStakingData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <Bookmark>Staking</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Wallet</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Stake</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Value</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (xenStakingData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staking</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Wallet</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Stake</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/4"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedXenStakingData.map((stake, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4 pr-20">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={stake.chainImg}
                alt={stake.chain}
              />
              <span>{stake.chain}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{styleNumber(stake.balance, 2)}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{styleNumber(stake.staked, 3)}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{formatToMoney(stake.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default XenStakeTable;
