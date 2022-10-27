import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { selectPulsexLiquidityPoolData } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney, styleNumber } from '../../utils/format';

const PulsexLiquidityPoolTable = () => {
  const pulsexLiquidityPoolData = useSelector(useCallback(selectPulsexLiquidityPoolData, []));

  const [sortedPulsexLiquidityPoolData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof pulsexLiquidityPoolData[number]
  >(pulsexLiquidityPoolData, 'usdValue', 'desc');

  return (
    <Card>
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
