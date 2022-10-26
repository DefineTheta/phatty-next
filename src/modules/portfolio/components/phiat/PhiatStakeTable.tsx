import Card from '@app-src/common/components/layout/Card';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { selectPhiatComponentData, selectPhiatStakingAPY } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSort from '../../hooks/useSort';
import { formatToMoney, styleNumber } from '../../utils/format';

const PhiatStakeTable = () => {
  const phiatStakingAPY = useSelector(useCallback(selectPhiatStakingAPY, []));
  const phiatStakingData = useSelector(useCallback(selectPhiatComponentData('STAKING'), []));
  const phiatTokenData = useSelector(useCallback(selectPhiatComponentData('PH_TOKENS'), []));

  const styledPhiatStakingAPY = useMemo(
    () => styleNumber(phiatStakingAPY, 2) + '%',
    [phiatStakingAPY]
  );

  const [sortedPhiatTokeData, sortKey, sortOrder, handleTableHeaderClick] = useSort<
    typeof phiatTokenData[number]
  >(phiatTokenData, 'usdValue', 'desc');

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Token</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">USD Value</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">APY</TableHeaderRowCell>
      </TableHeaderRow>
      {phiatStakingData.map((stake, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={stake.image}
                alt={stake.symbol}
              />
              <span>{stake.symbol}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/3">{styleNumber(stake.balance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/3">{formatToMoney(stake.usdValue)}</TableRowCell>
          <TableRowCell className="basis-1/6">{styledPhiatStakingAPY}</TableRowCell>
        </TableRow>
      ))}
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Reward</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Balance</TableHeaderRowCell>
        <TableHeaderRowCell
          className="basis-1/2"
          onClick={() => handleTableHeaderClick('usdValue')}
          sorted={sortOrder}
          sortable
        >
          USD Value
        </TableHeaderRowCell>
      </TableHeaderRow>
      {sortedPhiatTokeData.map((token, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={token.image}
                alt={token.symbol}
              />
              <span>{token.symbol}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/3">{styleNumber(token.balance, 3)}</TableRowCell>
          <TableRowCell className="basis-1/2">{formatToMoney(token.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default PhiatStakeTable;
