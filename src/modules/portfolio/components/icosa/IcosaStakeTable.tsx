import Bookmark from '@app-src/common/components/Bookmark';
import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { selectIcosaStakeData } from '@app-src/store/portfolio/selectors';
import { Portfolio } from '@app-src/store/portfolio/types';
import { useCallback } from 'react';
import useFilter from '../../hooks/useFilter';
import { formatToMoney, styleNumber } from '../../utils/format';

type IIcosaStakeTableProps = {
  page: Portfolio;
  loading: boolean;
};

const IcosaStakeTable = ({ page, loading }: IIcosaStakeTableProps) => {
  const icosaHedronStakingData = useAppSelector(
    useCallback(selectIcosaStakeData('HEDRON', page), [page])
  );
  const icosaIcsaStakingData = useAppSelector(
    useCallback(selectIcosaStakeData('ICSA', page), [page])
  );

  const [filteredIcosaHedronStakingData] = useFilter<typeof icosaHedronStakingData[number]>(
    icosaHedronStakingData,
    'usdValue',
    0
  );
  const [filteredIcosaIcsaStakingData] = useFilter<typeof icosaIcsaStakingData[number]>(
    icosaIcsaStakingData,
    'usdValue',
    0
  );

  if (loading) {
    return (
      <Card>
        <Bookmark>Staking</Bookmark>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Staked Points</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Min Staking Days</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Value</TableHeaderRowCell>
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
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  if (filteredIcosaHedronStakingData.length === 0 && filteredIcosaIcsaStakingData.length === 0) {
    return null;
  }

  return (
    <Card>
      <Bookmark>Staking</Bookmark>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Balance</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Staked Points</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Min Staking Days</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Value</TableHeaderRowCell>
      </TableHeaderRow>
      {filteredIcosaHedronStakingData.map((stake, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4 pr-20">{`${styleNumber(
            stake.stakedHedron,
            2
          )} HDRN`}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{stake.stakePoints}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{stake.minStakeDays}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{formatToMoney(stake.usdValue)}</TableRowCell>
        </TableRow>
      ))}
      {filteredIcosaIcsaStakingData.map((stake, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4 pr-20">{`${styleNumber(
            stake.stakedIcsa,
            2
          )} ICSA`}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{stake.stakePoints}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{stake.minStakeDays}</TableRowCell>
          <TableRowCell className="basis-1/4 pr-20">{formatToMoney(stake.usdValue)}</TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default IcosaStakeTable;
