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
  totalBalance: number;
  totalInt: number;
  usdValue: number;
};

export type HexChainItem = {
  data: HexTokenItem[];
  totalValue: number;
};

export type HexResponse = {
  data: {
    ETHEREUM: HexChainItem;
    TPLS: HexChainItem;
  };
  error?: string;
  next: number | null;
};

// PHIAT Types

export type PhiatTokenItem = {
  address: string;
  balance: number;
  symbol: string;
  image: string;
  usdValue: number;
};

export type PhiatComponentItem = {
  data: PhiatTokenItem[];
  totalValue: number;
};

export type PhiatData = {
  STABLE_DEBT: PhiatComponentItem;
  VARIABLE_DEBT: PhiatComponentItem;
  LENDING: PhiatComponentItem;
  STAKING: PhiatComponentItem;
  PH_TOKENS: PhiatComponentItem;
  STAKING_APY: number;
};

export type PhiatResponse = {
  data: PhiatData;
  error?: string;
  next: number | null;
};

// PULSEX Types

export type PulsexTokenItem = {
  tokenOne: {
    address: string;
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
  };
  tokenTwo: {
    address: string;
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
  };
  usdValue: number;
  ratio: number;
};

export type PulsexComponentItem = {
  data: PulsexTokenItem[];
  totalValue: number;
};

export type PulsexResponse = {
  data: {
    LIQUIDITY_POOL: PulsexComponentItem;
  };
  error?: string;
};
