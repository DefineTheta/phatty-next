import { HedronIcosaStakeItem, IcsaIcosaStakeItem } from '@app-src/server/icosa';
import {
  HedronItem,
  HexTokenItem,
  PancakeFarmTokenItem,
  PancakeLPTokenItem,
  PhamousItem,
  PhiatTokenItem,
  PulsexTokenItem,
  SushiItem,
  UniV2Item,
  UniV3Item,
  WalletTokenItem,
  XenMintItem,
  XenStakeItem
} from '@app-src/types/api';

export enum ProtocolImgEnum {
  WALLET = 'https://assets.debank.com/static/media/wallet.d67a695b.svg',
  HEX = 'https://cryptologos.cc/logos/hex-hex-logo.svg?v=022',
  PHIAT = 'https://phiat.io/public/images/favicon.png',
  PULSEX = 'https://phiat.io/public/images/pulsex.jpeg',
  PANCAKE = 'https://cryptologos.cc/logos/pancakeswap-cake-logo.svg?v=022',
  UNISWAPV2 = 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1069.png',
  UNISWAPV3 = 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1348.png'
}

export const ProtocolEnum = {
  WALLET: 'WALLET',
  HEX: 'HEX',
  PHIAT: 'PHIAT',
  PULSEX: 'PULSEX',
  PANCAKE: 'PANCAKE',
  SUSHI: 'SUSHI',
  UNISWAPV2: 'UNISWAPV2',
  UNISWAPV3: 'UNISWAPV3',
  HEDRON: 'HEDRON',
  PHAMOUS: 'PHAMOUS',
  XEN: 'XEN',
  ICOSA: 'ICOSA'
} as const;

export const ChainEnum = {
  ETH: 'ETH',
  TPLS: 'TPLS',
  BSC: 'BSC',
  MATIC: 'MATIC',
  AVAX: 'AVAX',
  FTM: 'FTM',
  ARBI: 'ARBI'
} as const;

export type Chain = typeof ChainEnum[keyof typeof ChainEnum];

export enum HexDataComponentEnum {
  ETH = 'ETH',
  TPLS = 'TPLS'
}

export enum PhiatDataComponentEnum {
  STABLE_DEBT = 'STABLE_DEBT',
  VARIABLE_DEBT = 'VARIABLE_DEBT',
  LENDING = 'LENDING',
  STAKING = 'STAKING',
  PH_TOKENS = 'PH_TOKENS'
}

export enum PulsexDataComponentEnum {
  LIQUIDITY_POOL = 'LIQUIDITY_POOL'
}

export enum PancakeDataComponentEnum {
  LIQUIDITY_POOL = 'LIQUIDITY_POOL',
  FARMING = 'FARMING'
}

export enum SushiDataComponentEnum {
  LIQUIDITY_POOL = 'LIQUIDITY_POOL'
}

export enum UniswapV2DataComponentEnum {
  LIQUIDITY_POOL = 'LIQUIDITY_POOL'
}

export enum UniswapV3DataComponentEnum {
  LIQUIDITY_POOL = 'LIQUIDITY_POOL'
}

export enum HedronDataComponentEnum {
  ETH = 'ETH',
  TPLS = 'TPLS'
}

export const PhamousDataComponentEnum = {
  LIQUIDITY_PROVIDING: 'LIQUIDITY_PROVIDING',
  STAKING: 'STAKING',
  REWARD: 'REWARD'
} as const;

export type PhamousDataComponent =
  typeof PhamousDataComponentEnum[keyof typeof PhamousDataComponentEnum];

export const XenDataComponentEnum = {
  STAKING: 'STAKING',
  MINTING: 'MINTING'
} as const;

export type XenDataComponent = typeof XenDataComponentEnum[keyof typeof XenDataComponentEnum];

export const IcosaDataComponentEnum = {
  HEDRON: 'HEDRON',
  ICSA: 'ICSA'
} as const;

export type IcosaDataComponent = typeof IcosaDataComponentEnum[keyof typeof IcosaDataComponentEnum];

export interface ProtocolData {
  loading: boolean;
  error: boolean;
}

interface WalletData extends ProtocolData {
  total: Record<Chain, number>;
  data: Record<Chain, WalletTokenItem[]>;
}

interface HexData extends ProtocolData {
  total: Record<HexDataComponentEnum, number>;
  totalTSharesPercentage: Record<HexDataComponentEnum, number>;
  data: Record<keyof typeof HexDataComponentEnum, HexTokenItem[]>;
}

interface PhiatData extends ProtocolData {
  total: {
    TPLS: number;
  };
  balance: {
    STAKING: number;
  };
  data: Record<keyof typeof PhiatDataComponentEnum, PhiatTokenItem[]> & { STAKING_APY: number };
}

interface PulsexData extends ProtocolData {
  total: Record<PulsexDataComponentEnum, number>;
  data: Record<keyof typeof PulsexDataComponentEnum, PulsexTokenItem[]>;
}

interface PancakeData extends ProtocolData {
  total: Record<PancakeDataComponentEnum, number>;
  data: {
    LIQUIDITY_POOL: PancakeLPTokenItem[];
    FARMING: PancakeFarmTokenItem[];
  };
}

interface SushiData extends ProtocolData {
  total: Record<SushiDataComponentEnum, number>;
  data: {
    LIQUIDITY_POOL: SushiItem[];
  };
}

interface UniswapV2Data extends ProtocolData {
  total: Record<UniswapV2DataComponentEnum, number>;
  data: Record<keyof typeof UniswapV2DataComponentEnum, UniV2Item[]>;
}

interface UniswapV3Data extends ProtocolData {
  total: Record<UniswapV3DataComponentEnum, number>;
  data: Record<keyof typeof UniswapV3DataComponentEnum, UniV3Item[]>;
}

interface HedronData extends ProtocolData {
  total: Record<HedronDataComponentEnum, number>;
  data: Record<HedronDataComponentEnum, HedronItem[]>;
}

interface PhamousData extends ProtocolData {
  total: {
    TPLS: number;
  };
  balance: {
    STAKING: number;
  };
  data: Record<PhamousDataComponent, PhamousItem[]>;
}

interface XenData extends ProtocolData {
  total: {
    ETH: number;
  };
  data: {
    [XenDataComponentEnum.STAKING]: XenStakeItem[];
    [XenDataComponentEnum.MINTING]: XenMintItem[];
  };
}

interface IcosaData extends ProtocolData {
  total: {
    ETH: number;
  };
  data: {
    [IcosaDataComponentEnum.HEDRON]: HedronIcosaStakeItem[];
    [IcosaDataComponentEnum.ICSA]: IcsaIcosaStakeItem[];
  };
}

export interface PortfolioData {
  displayAddress: string;
  addresses: string[];
  hasFetched: boolean;
  [ProtocolEnum.WALLET]: WalletData;
  [ProtocolEnum.HEX]: HexData;
  [ProtocolEnum.PHIAT]: PhiatData;
  [ProtocolEnum.PULSEX]: PulsexData;
  [ProtocolEnum.PANCAKE]: PancakeData;
  [ProtocolEnum.SUSHI]: SushiData;
  [ProtocolEnum.UNISWAPV2]: UniswapV2Data;
  [ProtocolEnum.UNISWAPV3]: UniswapV3Data;
  [ProtocolEnum.HEDRON]: HedronData;
  [ProtocolEnum.PHAMOUS]: PhamousData;
  [ProtocolEnum.XEN]: XenData;
  [ProtocolEnum.ICOSA]: IcosaData;
}

export const PortfolioEnum = {
  PROFILE: 'PROFILE',
  BUNDLE: 'BUNDLE',
  PUBLIC: 'PUBLIC'
} as const;

export type Portfolio = typeof PortfolioEnum[keyof typeof PortfolioEnum];

export type PortfolioState = Record<Portfolio, PortfolioData>;
