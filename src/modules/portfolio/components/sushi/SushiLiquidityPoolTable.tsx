import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectBundleSushiLiquidityPoolData } from '@app-src/store/bundles/selectors';
import { selectSushiLiquidityPoolData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

type ISushiLiquidityPoolTableProps = {
  page: 'profile' | 'bundle';
  loading: boolean;
};

const SushiLiquidityPoolTable = ({ page, loading }: ISushiLiquidityPoolTableProps) => {
  const sushiLPData = useSelector(
    useCallback(
      page === 'profile' ? selectSushiLiquidityPoolData : selectBundleSushiLiquidityPoolData,
      [page]
    )
  );

  const [sortedSushiLPData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof sushiLPData[number]
  >(sushiLPData, 'usdValue', 'desc');

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
            <TableRowCell className="pr-20 basis-1/4">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/2">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/4">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (sortedSushiLPData.length === 0) {
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
      {sortedSushiLPData.map((item, index) => (
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
              <div className="w-20 h-20 -ml-16">
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

export default SushiLiquidityPoolTable;
