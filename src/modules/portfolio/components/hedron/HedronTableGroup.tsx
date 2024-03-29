import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { Portfolio, PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { fetchHedronData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectHedronComponentTotal,
  selectHedronError,
  selectHedronLoading
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import HedronStakeTable from './HedronStakeTable';

type IHedronTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const HedronTableGroup = ({ page, currentChains }: IHedronTableGroupProps) => {
  const dispatch = useAppDispatch();

  const hedronEthTotal = useAppSelector(
    useCallback(selectHedronComponentTotal('ETH', page), [page])
  );
  const hedronTplsTotal = useAppSelector(
    useCallback(selectHedronComponentTotal('TPLS', page), [page])
  );
  const loading = useAppSelector(useCallback(selectHedronLoading(page), [page]));
  const error = useAppSelector(useCallback(selectHedronError(page), [page]));

  const styledHedronEthTotal = useMemo(() => formatToMoney(hedronEthTotal), [hedronEthTotal]);
  const styledHedronTplsTotal = useMemo(() => formatToMoney(hedronTplsTotal), [hedronTplsTotal]);

  const fetchTableData = useCallback(() => dispatch(fetchHedronData(page)), [page, dispatch]);

  if (
    (!loading && !error && hedronEthTotal + hedronTplsTotal === 0) ||
    !isInCurrentChains(['ETH', 'TPLS'], currentChains)
  ) {
    return null;
  }

  return (
    <div id="hedron" className="flex w-full max-w-96 flex-col gap-y-24">
      {(loading || hedronEthTotal !== 0) && isInCurrentChains('ETH', currentChains) && (
        <div className="flex flex-col gap-y-12">
          <TableHeader
            tableName="Hedron"
            tableLink="https://hedron.pro/#/dapp"
            totalValue={styledHedronEthTotal}
            tablePrimaryImgSrc="/img/icon/hedron.webp"
            tablePrimaryImgAlt="Hedron"
            tableSecondaryImgSrc="/img/chains/eth.svg"
            tableSecondaryImgAlt="Ethereum"
          />
          <TableWrapper error={error} handleRetry={fetchTableData}>
            <HedronStakeTable chain="ETH" page={page} loading={loading} />
          </TableWrapper>
        </div>
      )}
      {(loading || hedronTplsTotal !== 0) && isInCurrentChains('TPLS', currentChains) && (
        <div className="flex flex-col gap-y-12">
          <TableHeader
            tableName="Hedron"
            tableLink="https://hedron.pro/#/dapp"
            totalValue={styledHedronTplsTotal}
            tablePrimaryImgSrc="/img/icon/hedron.webp"
            tablePrimaryImgAlt="Hedron"
            tableSecondaryImgSrc="/img/chains/tpls.svg"
            tableSecondaryImgAlt="TPLS"
          />
          <TableWrapper error={error} handleRetry={fetchTableData}>
            <HedronStakeTable chain="TPLS" page={page} loading={loading} />
          </TableWrapper>
        </div>
      )}
    </div>
  );
};

export default HedronTableGroup;
