import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectWalletData } from '@app-src/store/portfolio/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { PORTFOLIO_WALLET_FILTER_AMOUNT } from '../../constants/data';
import useFilter from '../../hooks/useFilter';
import { Portfolio, PortfolioChain } from '../../types/portfolio';

type IWalletTableProps = {
  page: Portfolio;
  chains: PortfolioChain[];
  loading: boolean;
};

const WalletTable = ({ page, chains, loading }: IWalletTableProps) => {
  const walletData = useSelector(useCallback(selectWalletData(chains, page), [page, chains]));

  const [filteredWalletData, isFiltered, setIsFiltered] = useFilter<typeof walletData[number]>(
    walletData,
    'usdValue',
    PORTFOLIO_WALLET_FILTER_AMOUNT
  );

  const [sortedWalletData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof filteredWalletData[number]
  >(filteredWalletData, 'usdValue', 'desc');

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
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/12 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (walletData.length === 0) {
    return null;
  }

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/12 md:basis-1/4">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-3/12 md:block md:basis-1/4">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="hidden md:block md:basis-1/4">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-4/12 md:basis-1/6"
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
          <TableRowCell className="basis-1/12 md:basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={item.chainImg}
                alt={item.chain}
              />
              <span className="hidden md:block">{item.chain}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-3/12 md:block md:basis-1/4">
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
          <TableRowCell className="hidden md:block md:basis-1/4">
            {styleNumber(item.balance, 3)}
          </TableRowCell>
          <TableRowCell className="basis-4/12 md:basis-1/6">
            {formatToMoney(item.usdValue)}
          </TableRowCell>
          <TableRowCell className="basis-1/12">
            {item.chain === 'TPLS' && (
              <a
                className="bg-purple-a cursor-pointer rounded-full px-10 py-1 text-md font-bold text-text-200 underline underline-offset-2"
                target="_blank"
                href={
                  item.name === 'PHAME'
                    ? 'https://testnet.phamous.io/#/earn'
                    : 'https://testnet.phiat.io/markets'
                }
                rel="noreferrer"
              >
                {item.name === 'PHAME' ? 'Stake' : 'Earn'}
              </a>
            )}
          </TableRowCell>
        </TableRow>
      ))}
      <div className="mt-6 w-full text-center md:mt-4">
        <span className="text-md tracking-wide text-text-100">
          {isFiltered
            ? `Only showing results with value > $${PORTFOLIO_WALLET_FILTER_AMOUNT}.`
            : 'Showing all results.'}
          <a
            className="ml-4 cursor-pointer font-bold underline underline-offset-2"
            onClick={() => setIsFiltered((current) => !current)}
          >
            {isFiltered ? 'Show all?' : 'Show less?'}
          </a>
        </span>
      </div>
    </Card>
  );
};

export default WalletTable;
