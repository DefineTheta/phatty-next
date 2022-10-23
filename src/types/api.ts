export type WalletTokenItem = {
  name: string;
  balance: number;
  chain: string;
  price: number;
  chainImg: string;
  tokenImg: string;
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

// HEX Types

export type HexTokenItem = {
  tShares: number;
  tSharesP: number;
  stakingEnd: string;
  totalBalance: string;
  totalInt: string;
  usdValue: number;
};

export type HexChainItem = {
  data: HexTokenItem[];
  totalValue: number;
};

export type HexResponse = {
  ETHEREUM: HexChainItem;
  TPLS: HexChainItem;
};
