export interface ApiBaseResponse {
  error?: string;
  next: number | null;
}

export interface AuthResponse {
  verified: boolean;
}

export interface BundleResponse {
  data: string[];
  error?: string;
}

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
    ETHEREUM: WalletChainItem;
    BSC: WalletChainItem;
    TPLS: WalletChainItem;
  };
}

// HEX Types

export interface HexTokenItem {
  tShares: number;
  tSharesP: number;
  stakingEnd: string;
  totalBalance: number;
  totalInt: number;
  usdValue: number;
}

export interface HexChainItem {
  data: HexTokenItem[];
  totalValue: number;
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
