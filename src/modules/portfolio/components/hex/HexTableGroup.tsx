import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectHexComponentTotal, selectHexStakeLoading } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import HexStakeTable from './HexStakeTable';

const HexTableGroup = () => {
  const hexEthTotal = useSelector(useCallback(selectHexComponentTotal('ETHEREUM'), []));
  const hexTplsTotal = useSelector(useCallback(selectHexComponentTotal('TPLS'), []));
  const loading = useSelector(useCallback(selectHexStakeLoading, []));

  const styledHexEthTotal = useMemo(() => formatToMoney(hexEthTotal), [hexEthTotal]);
  const styledHexTplsTotal = useMemo(() => formatToMoney(hexTplsTotal), [hexTplsTotal]);

  if (hexEthTotal + hexTplsTotal === 0 && !loading) {
    return null;
  }

  return (
    <div id="#hex" className="w-full max-w-96 flex flex-col gap-y-24">
      {hexEthTotal !== 0 && (
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
          <HexStakeTable chain="ETHEREUM" loading={loading} />
        </div>
      )}
      {hexTplsTotal !== 0 && (
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
          <HexStakeTable chain="TPLS" loading={loading} />
        </div>
      )}
    </div>
  );
};

export default HexTableGroup;
