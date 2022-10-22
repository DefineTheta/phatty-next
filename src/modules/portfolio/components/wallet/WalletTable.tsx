import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectWalletData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const WalletTable = () => {
  const walletData = useSelector(useCallback(selectWalletData, []));

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">USD Value</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/12"></TableHeaderRowCell>
      </TableHeaderRow>
      {walletData.map((item, index) => (
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
