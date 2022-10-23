import TableHeader from '@app-src/common/components/table/TableHeader';
import HexStakeTable from './HexStakeTable';

const HexTableGroup = () => {
  return (
    <div className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableId="#hex"
        tableName="Hex.com"
        tableLink="https://go.hex.com/stake"
        totalValue="$1,234,567,89"
        tablePrimaryImgSrc="/img/icon/hex.svg"
        tablePrimaryImgAlt="Hex"
        tableSecondaryImgSrc="/img/chains/eth.svg"
        tableSecondaryImgAlt="Ethereum"
      />
      <div className="flex flex-col gap-y-24">
        <HexStakeTable chain="ETHEREUM" />
        <HexStakeTable chain="TPLS" />
      </div>
    </div>
  );
};

export default HexTableGroup;
