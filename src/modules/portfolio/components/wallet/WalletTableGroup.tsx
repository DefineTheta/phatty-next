import TableHeader from '@app-src/common/components/table/TableHeader';
import WalletTable from './WalletTable';

const WalletTableGroup = () => {
  return (
    <div className="w-full max-w-96 flex flex-col gap-y-12">
      <TableHeader
        tableId="#wallet"
        tableName="Wallet"
        totalValue="$1,234,567.89"
        tablePrimaryImgSrc="/img/icon/wallet.svg"
        tablePrimaryImgAlt="Wallet"
      />
      <WalletTable />
    </div>
  );
};

export default WalletTableGroup;
