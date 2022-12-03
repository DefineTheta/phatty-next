import TableHeader from '@app-src/common/components/table/TableHeader';
import TableWrapper from '@app-src/common/components/table/TableWrapper';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { fetchBundleHexData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleHexComponentTotal,
  selectBundleHexError,
  selectBundleHexStakeLoading,
  selectBundleHexToatlTSharesPercentage
} from '@app-src/store/bundles/selectors';
import { fetchHexData } from '@app-src/store/protocol/protocolSlice';
import {
  selectHexComponentTotal,
  selectHexStakeLoading,
  selectHexToatlTSharesPercentage,
  selectProfileHexError
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { formatToMoney } from '../../utils/format';
import { isInCurrentChains } from '../../utils/misc';
import HexStakeTable from './HexStakeTable';

type IHexTableGroupProps = {
  page: 'profile' | 'bundle';
  currentChains: PortfolioChain[];
};

const HexTableGroup = ({ page, currentChains }: IHexTableGroupProps) => {
  const dispatch = useAppDispatch();

  const hexEthTotal = useAppSelector(
    useCallback(
      page === 'profile' ? selectHexComponentTotal('ETH') : selectBundleHexComponentTotal('ETH'),
      [page]
    )
  );
  const hexTplsTotal = useAppSelector(
    useCallback(
      page === 'profile' ? selectHexComponentTotal('TPLS') : selectBundleHexComponentTotal('TPLS'),
      [page]
    )
  );
  const loading = useAppSelector(
    useCallback(page === 'profile' ? selectHexStakeLoading : selectBundleHexStakeLoading, [page])
  );
  const error = useAppSelector(
    useCallback(page === 'profile' ? selectProfileHexError : selectBundleHexError, [page])
  );
  const hexEthSeaCreature = useAppSelector(
    useCallback(
      page === 'profile'
        ? selectHexToatlTSharesPercentage('ETH')
        : selectBundleHexToatlTSharesPercentage('ETH'),
      []
    )
  );
  const hexTplsSeaCreature = useAppSelector(
    useCallback(
      page === 'profile'
        ? selectHexToatlTSharesPercentage('TPLS')
        : selectBundleHexToatlTSharesPercentage('TPLS'),
      []
    )
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

  const fetchTableData = useCallback(() => {
    if (page === 'profile') dispatch(fetchHexData());
    else dispatch(fetchBundleHexData());
  }, [page, dispatch]);

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
