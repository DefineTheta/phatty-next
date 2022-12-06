import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { Portfolio, PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { fetchHexData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectHexComponentTotal,
  selectHexError,
  selectHexStakeLoading,
  selectHexToatlTSharesPercentage
} from '@app-src/store/portfolio/selectors';
import { useCallback, useMemo } from 'react';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import HexStakeTable from './HexStakeTable';

type IHexTableGroupProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
};

const HexTableGroup = ({ page, currentChains }: IHexTableGroupProps) => {
  const dispatch = useAppDispatch();

  const hexEthTotal = useAppSelector(useCallback(selectHexComponentTotal('ETH', page), [page]));
  const hexTplsTotal = useAppSelector(useCallback(selectHexComponentTotal('TPLS', page), [page]));
  const loading = useAppSelector(useCallback(selectHexStakeLoading(page), [page]));
  const error = useAppSelector(useCallback(selectHexError(page), [page]));
  const hexEthSeaCreature = useAppSelector(
    useCallback(selectHexToatlTSharesPercentage('ETH', page), [])
  );
  const hexTplsSeaCreature = useAppSelector(
    useCallback(selectHexToatlTSharesPercentage('TPLS', page), [])
  );

  const styledHexEthTotal = useMemo(
    () =>
      `${hexEthSeaCreature.sum} ${hexEthSeaCreature.name} ${hexEthSeaCreature.icon} ${formatToMoney(
        hexEthTotal
      )}`,
    [hexEthTotal, hexEthSeaCreature]
  );
  const styledHexTplsTotal = useMemo(
    () =>
      `${hexTplsSeaCreature.sum} ${hexTplsSeaCreature.name} ${
        hexTplsSeaCreature.icon
      } ${formatToMoney(hexTplsTotal)}`,
    [hexTplsTotal, hexTplsSeaCreature]
  );

  const fetchTableData = useCallback(() => dispatch(fetchHexData(page)), [page, dispatch]);

  if (
    (!loading && !error && hexEthTotal + hexTplsTotal === 0) ||
    !isInCurrentChains(['ETH', 'TPLS'], currentChains)
  ) {
    return null;
  }

  return (
    <div id="hex" className="flex w-full max-w-96 flex-col gap-y-24">
      {(loading || hexEthTotal !== 0) && isInCurrentChains('ETH', currentChains) && (
        <div className="flex flex-col gap-y-12">
          <TableHeader
            tableName="Hex.com"
            tableLink="https://go.hex.com/stake"
            totalValue={styledHexEthTotal}
            tablePrimaryImgSrc="/img/icon/hex.svg"
            tablePrimaryImgAlt="Hex"
            tableSecondaryImgSrc="/img/chains/eth.svg"
            tableSecondaryImgAlt="Ethereum"
          />
          <TableWrapper error={error} handleRetry={fetchTableData}>
            <HexStakeTable chain="ETH" page={page} loading={loading} />
          </TableWrapper>
        </div>
      )}
      {(loading || hexTplsTotal !== 0) && isInCurrentChains('TPLS', currentChains) && (
        <div className="flex flex-col gap-y-12">
          <TableHeader
            tableName="Hex.com"
            tableLink="https://go.hex.com/stake"
            totalValue={styledHexTplsTotal}
            tablePrimaryImgSrc="/img/icon/hex.svg"
            tablePrimaryImgAlt="Hex"
            tableSecondaryImgSrc="/img/chains/tpls.svg"
            tableSecondaryImgAlt="TPLS"
          />
          <TableWrapper error={error} handleRetry={fetchTableData}>
            <HexStakeTable chain="TPLS" page={page} loading={loading} />
          </TableWrapper>
        </div>
      )}
    </div>
  );
};

export default HexTableGroup;
