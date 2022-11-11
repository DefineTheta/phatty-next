import Card from '@app-src/common/components/layout/Card';
import SkeletonLoader from '@app-src/common/components/skeleton/SkeletonLoader';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { howLongAgo } from '@app-src/common/utils/time';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { fetchProfileHistory, setHistoryHasFetched } from '@app-src/store/history/historySlice';
import {
  selectProfileHistory,
  selectProfileHistoryFetched,
  selectProfileHistoryLoading
} from '@app-src/store/history/selectors';
import { selectProfileAddress } from '@app-src/store/protocol/selectors';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const HistoryTable = () => {
  const dispatch = useAppDispatch();

  const profileAddress = useSelector(useCallback(selectProfileAddress, []));
  const profileHistorData = useSelector(useCallback(selectProfileHistory, []));

  const hasFetched = useSelector(useCallback(selectProfileHistoryFetched, []));
  const loading = useSelector(useCallback(selectProfileHistoryLoading, []));

  useEffect(() => {
    if (hasFetched || !profileAddress) return;

    dispatch(setHistoryHasFetched(true));
    const fetchPromise = dispatch(fetchProfileHistory(profileAddress));
  }, [hasFetched, profileAddress]);

  if (loading) {
    return (
      <Card>
        <TableHeaderRow>
          <TableHeaderRowCell className="basis-1/4">Time</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/6">Chain</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/4">Transaction</TableHeaderRowCell>
          <TableHeaderRowCell className="basis-1/3">Tokens</TableHeaderRowCell>
        </TableHeaderRow>
        {Array.from({ length: 3 }, (x, i) => i).map((index) => (
          <TableRow key={index}>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/6 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/4 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
            <TableRowCell className="basis-1/3 pr-20">
              <SkeletonLoader className="h-30 w-full" />
            </TableRowCell>
          </TableRow>
        ))}
      </Card>
    );
  }

  return (
    <Card>
      <TableHeaderRow>
        <TableHeaderRowCell className="basis-1/4">Time</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/6">Chain</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/4">Transaction</TableHeaderRowCell>
        <TableHeaderRowCell className="basis-1/3">Tokens</TableHeaderRowCell>
      </TableHeaderRow>
      {profileHistorData.map((item, index) => (
        <TableRow key={index}>
          <TableRowCell className="basis-1/4">{howLongAgo(item.timeStamp)}</TableRowCell>
          <TableRowCell className="basis-1/6">
            <div className="flex flex-row gap-x-8">
              <Image
                className="rounded-full"
                width="20px"
                height="20px"
                src={item.image}
                alt={item.chain}
              />
              <span>{item.chain}</span>
            </div>
          </TableRowCell>
          <TableRowCell className="basis-1/4">
            <a
              className="bg-purple-a cursor-pointer rounded-full px-10 py-1 text-md font-bold text-white underline underline-offset-2"
              target="_blank"
              href={item.link}
              rel="noreferrer"
            >
              {item.functionName}
            </a>
          </TableRowCell>
          <TableRowCell className="basis-1/3">
            <div className="flex flex-col gap-y-2">
              {item.tokens.map((token, index) => (
                <div
                  key={index}
                  className={`flex flex-row gap-x-2 text-md ${
                    token.transaction === 'Receive'
                      ? 'text-green-400'
                      : token.transaction === 'Send'
                      ? 'text-red-400'
                      : 'text-text-200'
                  }`}
                >
                  <span>{token.token}</span>
                  <span>
                    {token.transaction === 'Receive' ? '+' : token.transaction === 'Send' && '-'}
                  </span>
                  <span>{formatToMoney(token.amount)}</span>
                </div>
              ))}
            </div>
          </TableRowCell>
        </TableRow>
      ))}
    </Card>
  );
};

export default HistoryTable;
