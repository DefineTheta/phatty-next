import TableHeader from '@app-src/common/components/table/TableHeader';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import {
  selectBundleHexComponentTotal,
  selectBundleHexStakeLoading
} from '@app-src/store/bundles/selectors';
import {
  selectHexComponentTotal,
  selectHexStakeLoading,
  selectHexToatlTSharesPercentage
} from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { formatToMoney } from '../../utils/format';
import { isCurrentChain, isCurrentChainIn } from '../../utils/misc';
import HexStakeTable from './HexStakeTable';

type IHexTableGroupProps = {
  page: 'profile' | 'bundle';
  chain: PortfolioChain;
};

const HexTableGroup = ({ page, chain }: IHexTableGroupProps) => {
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
  const hexEthSeaCreature = useAppSelector(useCallback(selectHexToatlTSharesPercentage('ETH'), []));
  const hexTplsSeaCreature = useAppSelector(
    useCallback(selectHexToatlTSharesPercentage('TPLS'), [])
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

  if ((hexEthTotal + hexTplsTotal === 0 && !loading) || !isCurrentChainIn(['ETH', 'TPLS'], chain)) {
    return null;
  }

  return (
    <div id="hex" className="w-full max-w-96 flex flex-col gap-y-24">
      {(loading || hexEthTotal !== 0) && isCurrentChain('ETH', chain) && (
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
          <HexStakeTable chain="ETH" page={page} loading={loading} />
        </div>
      )}
      {(loading || hexTplsTotal !== 0) && isCurrentChain('TPLS', chain) && (
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
          <HexStakeTable chain="TPLS" page={page} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default HexTableGroup;
