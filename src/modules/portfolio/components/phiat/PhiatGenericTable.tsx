import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectPhiatComponentData } from '@app-src/store/protocol/selectors';
import { PhiatDataComponentEnum } from '@app-src/store/protocol/types';
import Image from 'next/image';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

type IPhiatGenericTableProps = {
  component: keyof typeof PhiatDataComponentEnum;
};

const PhiatGenericTable = ({ component }: IPhiatGenericTableProps) => {
  const phiatComponentData = useSelector(useCallback(selectPhiatComponentData(component), []));

  const [sortedPhiatComponentData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof phiatComponentData[number]
  >(phiatComponentData, 'usdValue', 'desc');

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/3">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/3"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPhiatComponentData.map((data, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/3">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={data.image}
                alt={data.symbol}
              />
              <span>{data.symbol}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/3">{styleNumber(data.balance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/3">{formatToMoney(data.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhiatGenericTable;
