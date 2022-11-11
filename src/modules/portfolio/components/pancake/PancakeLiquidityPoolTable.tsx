import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectBundlePancakeLiquidityPoolData } from '@app-src/store/bundles/selectors';
import { selectPancakeLiquidityPoolData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPancakeLiquidityPoolTable = {
  page: 'profile' | 'bundle';
  loading: boolean;
};

const PancakeLiquidityPoolTable = ({ page, loading }: IPancakeLiquidityPoolTable) => {
  const pancakeLPData = useSelector(
    useCallback(
      page === 'profile' ? selectPancakeLiquidityPoolData : selectBundlePancakeLiquidityPoolData,
      [page]
    )
  );

  const [sortedPancakeLPData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof pancakeLPData[number]
  >(pancakeLPData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Pool</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/2">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">USD Value</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/2 pr-20">
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

  if (sortedPancakeLPData.length === 0) {
    return null;
  }

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Pool</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/2">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/4"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPancakeLPData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={item.tokenOne.image}
                alt={item.tokenOne.symbol}
              />
              <div className="-ml-16 h-20 w-20">
                <Image
                  className="rounded-full"
                  width="20px"
                  height="20px"
                  src={item.tokenTwo.image}
                  alt={item.tokenTwo.symbol}
                />
              </div>
              <span>{`${item.tokenOne.symbol} + ${item.tokenTwo.symbol}`}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/2">
            <div className="flex flex-row gap-y-2">
              <span>{`${styleNumber(item.tokenOne.balance, 2)} ${item.tokenOne.symbol}`}</span>
              <span>{`${styleNumber(item.tokenTwo.balance, 2)} ${item.tokenTwo.symbol}`}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4">{formatToMoney(item.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PancakeLiquidityPoolTable;
