import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectWalletData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

type IWalletTableProps = {
  loading: boolean;
};

const WalletTable = ({ loading }: IWalletTableProps) => {
  const walletData = useSelector(useCallback(selectWalletData, []));

  const [sortedWalletData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof walletData[number]
  >(walletData, 'usdValue', 'desc');

  if (loading) {
    return (
      <Card>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">USD Value</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/12"></TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="pr-20 basis-1/4">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/4">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/4">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/6">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
            <TableRowCell className="pr-20 basis-1/12">
              <SkeletonLoader className="w-full h-30" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (sortedWalletData.length === 0) {
    return null;
  }

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/6"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/12"></TableHeaderRowCell>
      </TableHeaderRow>
      {sortedWalletData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={item.chainImg}
                alt={item.chain}
              />
              <span>{item.chain}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={item.tokenImg}
                alt={item.name}
              />
              <span>{item.name}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4">{styleNumber(item.balance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/6">{formatToMoney(item.usdValue)}</TableRowCell>
          <TableRowCell className="basis-1/12">
            {item.chain === 'TPLS' && (
              <a
                className="px-10 py-1 bg-purple-a text-md font-bold underline underline-offset-2 text-text-200 rounded-full cursor-pointer"
                target="_blank"
                href="https://testnet.phiat.io/markets"
                rel="noreferrer"
              >
                Earn
              </a>
            )}
          </TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default WalletTable;
