import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectPancakeLiquidityPoolData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

const PancakeLiquidityPoolTable = () => {
  const pancakeLPData = useSelector(useCallback(selectPancakeLiquidityPoolData, []));

  const [sortedPancakeLPData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof pancakeLPData[number]
  >(pancakeLPData, 'usdValue', 'desc');

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

export default PancakeLiquidityPoolTable;
