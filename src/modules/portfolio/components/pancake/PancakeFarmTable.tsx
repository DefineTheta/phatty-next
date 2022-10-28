import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectPancakeFarmingData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

const PancakeFarmTable = () => {
  const pancakeFarmData = useSelector(useCallback(selectPancakeFarmingData, []));

  const [sortedPancakeFarmData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof pancakeFarmData[number]
  >(pancakeFarmData, 'usdValue', 'desc');

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Pool</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Rewards</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/5"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPancakeFarmData.map((item, index) => (
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
          <TableRowCell className="basis-1/4">
            <div className="flex flex-col gap-y-2">
              <span>{`${styleNumber(item.tokenOne.balance, 2)} ${item.tokenOne.symbol}`}</span>
              <span>{`${styleNumber(item.tokenTwo.balance, 2)} ${item.tokenTwo.symbol}`}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4">
            {`${styleNumber(item.pendingCakeBalance, 2)} Cake ${formatToMoney(
              item.pendingCakeValue
            )}`}
          </TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PancakeFarmTable;
