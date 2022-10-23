import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import useSort from '@app-src/modules/portfolio/hooks/useSort';
import { formatToMoney, styleNumber } from '@app-src/modules/portfolio/utils/format';
import { selectHexStakeData } from '@app-src/store/protocol/selectors';
import { HexDataComponentEnum } from '@app-src/store/protocol/types';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

type IHexStakeTableProps = {
  chain: keyof typeof HexDataComponentEnum;
};

const HexStakeTable = ({ chain }: IHexStakeTableProps) => {
  const hexStakeData = useSelector(useCallback(selectHexStakeData(chain), [chain]));

  const [sortedHexStakeData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof hexStakeData[number]
  >(hexStakeData, 'usdValue', 'desc');

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/5">Staking End</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Total Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">Interest To Date</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">USD Value</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/5">TShares</TableHeaderRowCell>
      </TableHeaderRow>
      {sortedHexStakeData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/5">{`In ${item.stakingEnd} days`}</TableRowCell>
          <TableRowCell className="basis-1/5">{styleNumber(item.totalBalance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.totalInt)}</TableRowCell>
          <TableRowCell className="basis-1/5">{formatToMoney(item.usdValue)}</TableRowCell>
          <TableRowCell className="basis-1/5">{styleNumber(item.tShares, 2)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default HexStakeTable;
