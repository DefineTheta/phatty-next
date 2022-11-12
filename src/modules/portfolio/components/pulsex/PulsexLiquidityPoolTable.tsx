import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { selectBundlePulsexLiquidityPoolData } from '@app-src/store/bundles/selectors';
import { selectPulsexLiquidityPoolData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPulsexLiquidityPoolTableProps = {
  page: 'profile' | 'bundle';
  loading: boolean;
};

const PulsexLiquidityPoolTable = ({ page, loading }: IPulsexLiquidityPoolTableProps) => {
  const pulsexLiquidityPoolData = useSelector(
    useCallback(
      page === 'profile' ? selectPulsexLiquidityPoolData : selectBundlePulsexLiquidityPoolData,
      [page]
    )
  );

  const [sortedPulsexLiquidityPoolData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof pulsexLiquidityPoolData[number]
  >(pulsexLiquidityPoolData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <Bookmark>Liquidity Pool</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/5">Pool</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/5">Share of Pool</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-2/5">Balance</TableHeaderRowCell>
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
            <TableRowCell className="basis-2/5 pr-20">
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

  if (sortedPulsexLiquidityPoolData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Liquidity Pool</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/5">Pool</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Share of Pool</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-2/5">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/5"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPulsexLiquidityPoolData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/5">
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
          <TableRowCell className="basis-1/5">{`${styleNumber(item.ratio, 2)}%`}</TableRowCell>
          <TableRowCell className="basis-2/5">
            <div className="flex flex-col gap-y-2">
              <span>
                {`${styleNumber(item.tokenOne.balance, 2)} ${item.tokenOne.symbol} (${styleNumber(
                  item.tokenOne.value,
                  2
                )})`}
              </span>
              <span>
                {`${styleNumber(item.tokenTwo.balance, 2)} ${item.tokenTwo.symbol} (${styleNumber(
                  item.tokenTwo.value,
                  2
                )})`}
              </span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PulsexLiquidityPoolTable;
