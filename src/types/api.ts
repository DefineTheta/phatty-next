export type WalletTokenItem = {
  name: string;
  balance: number;
  chain: string;
  price: number;
  chainImg: string;
  usdValue: number;
};

export type WalletChainItem = {
  data: WalletTokenItem[];
  totalValue: number;
};

export type WalletResponse = {
  ETHEREUM: WalletChainItem;
  BSC: WalletChainItem;
  TPLS: WalletChainItem;
};
