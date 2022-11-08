export interface ApiBaseResponse {
  error?: string;
  next: number | null;
}

export interface AuthResponse {
  success: boolean;
}

export interface BundleResponse {
  data: string[];
  error?: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  error?: string;
}

export interface HistoryItem {
  chain: string;
  image: string;
  functionName: string;
  link: string;
  timeStamp: number;
  tokens: HistoryToken[];
}

export interface HistoryToken {
  amount: number;
  image: string;
  token: string;
  transaction: string;
}

// WALLET Types

export interface WalletTokenItem {
  name: string;
  balance: number;
  chain: string;
  price: number;
  chainImg: string;
  tokenImg: string;
  usdValue: number;
}

export interface WalletChainItem {
  data: WalletTokenItem[];
  totalValue: number;
}

export interface WalletResponse {
  data: {
    ETH: WalletChainItem;
    BSC: WalletChainItem;
    TPLS: WalletChainItem;
  };
}

// HEX Types

export interface HexTokenItem {
  tShares: number;
  tSharesPercentage: number;
  stakingEnd: string;
  totalBalance: number;
  totalInt: number;
  usdValue: number;
}

export interface HexChainItem {
  data: HexTokenItem[];
  totalValue: number;
  totalTSharesPercentage: number;
}

export interface HexResponse extends ApiBaseResponse {
  data: {
    ETHEREUM: HexChainItem;
    TPLS: HexChainItem;
  };
}

// PHIAT Types

export interface PhiatTokenItem {
  address: string;
  balance: number;
  symbol: string;
  image: string;
  usdValue: number;
}

export interface PhiatComponentItem {
  data: PhiatTokenItem[];
  totalValue: number;
}

export interface PhiatData {
  STABLE_DEBT: PhiatComponentItem;
  VARIABLE_DEBT: PhiatComponentItem;
  LENDING: PhiatComponentItem;
  STAKING: PhiatComponentItem;
  PH_TOKENS: PhiatComponentItem;
  STAKING_APY: number;
}

export interface PhiatResponse {
  data: PhiatData;
  error?: string;
  next: number | null;
}

// PULSEX Types

export interface PulsexTokenItem {
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
}

export interface PulsexComponentItem {
  data: PulsexTokenItem[];
  totalValue: number;
}

export interface PulsexResponse {
  data: {
    LIQUIDITY_POOL: PulsexComponentItem;
  };
  error?: string;
}

// PANCAKE Types

export interface PancakeLPTokenItem {
  tokenOne: {
    address: string;
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
    reserve: number;
    decimals: number;
  };
  tokenTwo: {
    address: string;
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
    reserve: number;
    decimals: number;
  };
  usdValue: number;
  ratio: number;
  supply: number;
  liquidityPoolAddress: string;
}

export interface PancakeFarmTokenItem {
  tokenOne: {
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
  };
  tokenTwo: {
    balance: number;
    value: number;
    symbol: string;
    price: number;
    image: string;
  };
  usdValue: number;
  pendingCakeBalance: number;
  pendingCakeValue: number;
}

export interface PancakeResponse {
  data: {
    LIQUIDITY_POOL: {
      data: PancakeLPTokenItem[];
      totalValue: number;
    };
    FARMING: {
      data: PancakeFarmTokenItem[];
      totalValue: number;
    };
  };
  error?: string;
}

// SUSHI Types

export type SushiToken = {
  symbol: string;
  image: string;
  balance: number;
};

export type SushiItem = {
  tokenOne: SushiToken;
  tokenTwo: SushiToken;
  usdValue: number;
};

export type SushiResponse = {
  data: {
    LIQUIDITY_POOL: {
      data: SushiItem[];
      totalValue: number;
    };
  };
  error?: string;
};

// UNIV2 Types

export type UniV2Token = {
  symbol: string;
  image: string;
  balance: number;
};

export type UniV2Item = {
  tokenOne: UniV2Token;
  tokenTwo: UniV2Token;
  usdValue: number;
};

export type UniV2Response = {
  data: {
    LIQUIDITY_POOL: {
      data: UniV2Item[];
      totalValue: number;
    };
  };
  error?: string;
};

// UNIV3 Types

export type UniV3Token = {
  symbol: string;
  image: string;
  balance: number;
  fee: number;
};

export type UniV3Item = {
  tokenOne: UniV3Token;
  tokenTwo: UniV3Token;
  usdValue: number;
};

export type UniV3Response = ApiBaseResponse & {
  data: {
    LIQUIDITY_POOL: {
      data: UniV3Item[];
      totalValue: number;
    };
  };
};

// HEDRON Types

export type HedronItem = {
  stakeType: 'Tokenized' | 'Instanced';
  hexStaked: number;
  tShares: number;
  hedronMintable: number;
  servedDays: number;
  usdValue: number;
};

export type HedronChainItem = {
  data: HedronItem[];
  totalValue: number;
};

export type HedronResponse = {
  data: {
    ETH: HedronChainItem;
    TPLS: HedronChainItem;
  };
};
