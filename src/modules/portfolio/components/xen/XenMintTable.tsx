import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectXenComponentData } from '@app-src/store/portfolio/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import useSort from '../../hooks/useSort';
import { Portfolio } from '../../types/portfolio';
import { formatToMoney, styleNumber } from '../../utils/format';

type IXenMintTableProps = {
  page: Portfolio;
  loading: boolean;
};

const XenMintTable = ({ page, loading }: IXenMintTableProps) => {
  const xenMintingData = useAppSelector(
    useCallback(selectXenComponentData('MINTING', page), [page])
  );

  const [sortedXenMintingData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof xenMintingData[number]
  >(xenMintingData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <Bookmark>Minting</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Term (Days)</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Estimated Xen</TableHeaderRowCell>
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

  if (xenMintingData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Minting</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Term (Days)</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Estimated Xen</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/4"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedXenMintingData.map((mint, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4 pr-20">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={mint.chainImg}
                alt={mint.chain}
              />
              <span>{mint.chain}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{styleNumber(mint.term, 2)}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">
            {styleNumber(mint.estimatedXen, 2)}
          </TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{formatToMoney(mint.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default XenMintTable;
