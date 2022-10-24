import TableHeader from '@app-src/common/components/table/TableHeader';
import { selectHexStakeTotal } from '@app-src/store/protocol/selectors';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { formatToMoney } from '../../utils/format';
import HexStakeTable from './HexStakeTable';

const HexTableGroup = () => {
  const hexEthTotal = useSelector(useCallback(selectHexStakeTotal('ETHEREUM'), []));
  const hexTplsTotal = useSelector(useCallback(selectHexStakeTotal('TPLS'), []));

  const styledHexEthTotal = useMemo(() => formatToMoney(hexEthTotal), [hexEthTotal]);
  const styledHexTplsTotal = useMemo(() => formatToMoney(hexTplsTotal), [hexTplsTotal]);

  return (
    <div id="#hex" className="w-full max-w-96 flex flex-col gap-y-24">
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
        <HexStakeTable chain="ETHEREUM" />
      </div>
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
        <HexStakeTable chain="TPLS" />
      </div>
    </div>
  );
};

export default HexTableGroup;
