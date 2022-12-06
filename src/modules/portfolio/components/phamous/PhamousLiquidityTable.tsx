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
import { Portfolio } from '../../types/portfolio';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPhamousLiquidityTableProps = {
  page: Portfolio;
  loading: boolean;
};

const PhamousLiquidityTable = ({ page, loading }: IPhamousLiquidityTableProps) => {
  const phamousLiquidityData = useAppSelector(
    useCallback(selectPhamousComponentData('LIQUIDITY_PROVIDING', page), [page])
  );

  if (loading) {
    return (
      <Card>
        <Bookmark>Liquidity Providing</Bookmark>
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
      </Card>
    );
  }

  if (phamousLiquidityData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Liquidity Providing</Bookmark>
      <>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/2">USD Value</TableHeaderRowCell>
        </TableHeaderRow>
        {phamousLiquidityData.map((item, index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4">
              <div className="flex flex-row gap-x-8">
                <Image
                  className="rounded-full"
                  width="20px"
                  height="20px"
                  src={item.image}
                  alt={item.symbol}
                />
                <span>{item.symbol}</span>
              </div>
            </TableRowCell>
            <TableRowCell className="basis-1/3">{styleNumber(item.balance, 3)}</TableRowCell>
            <TableRowCell className="basis-1/2">{formatToMoney(item.usdValue)}</TableRowCell>
          </TableRow>
        ))}
      </>
    </Card>
  );
};

export default PhamousLiquidityTable;
