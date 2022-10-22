import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
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
            <div className="flex flex-row gap-x-6">
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
          <TableRowCell className="basis-1/4">Token</TableRowCell>
          <TableRowCell className="basis-1/4">Token</TableRowCell>
          <TableRowCell className="basis-1/4">Token</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default WalletTable;
