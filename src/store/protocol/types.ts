// import {
//   MappedHexResponse,
//   UniV2Data,
//   UniV3Data,
//   WalletData as WalletAPIData
// } from 'src/types/api';
// import {
//   HexDataComponentEnum,
//   PancakeDataComponentEnum,
//   PhiatDataComponentEnum,
//   PulsexDataComponentEnum,
//   UniswapV2DataComponentEnum,
//   UniswapV3DataComponentEnum
// } from 'src/types/crypto';

import {
  HexTokenItem,
  PancakeFarmTokenItem,
  PancakeLPTokenItem,
  PhiatTokenItem,
  PulsexTokenItem,
  SushiItem,
  UniV2Item,
  UniV3Item,
  WalletTokenItem
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

export enum ProtocolEnum {
  WALLET = 'WALLET',
  HEX = 'HEX',
  PHIAT = 'PHIAT',
  PULSEX = 'PULSEX',
  PANCAKE = 'PANCAKE',
  SUSHI = 'SUSHI',
  UNISWAPV2 = 'UNISWAPV2',
  UNISWAPV3 = 'UNISWAPV3'
}

export enum WalletDataComponentEnum {
  ETHEREUM = 'ETHEREUM',
  TPLS = 'TPLS',
  BSC = 'BSC'
}

export enum HexDataComponentEnum {
  ETHEREUM = 'ETHEREUM',
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

export interface ProtocolsState {
  address: string;
  hasFetched: boolean;
  [ProtocolEnum.WALLET]: WalletData;
  [ProtocolEnum.HEX]: HexData;
  [ProtocolEnum.PHIAT]: PhiatData;
  [ProtocolEnum.PULSEX]: PulsexData;
  [ProtocolEnum.PANCAKE]: PancakeData;
  [ProtocolEnum.SUSHI]: SushiData;
  [ProtocolEnum.UNISWAPV2]: UniswapV2Data;
  [ProtocolEnum.UNISWAPV3]: UniswapV3Data;
}

export interface ProtocolData {
  loading: boolean;
  error: boolean;
}

type WalletItem = {
  name: string;
  price: number;
  balance: number;
  usdValue: number;
  img: string;
  chain: string;
  chainImg: string;
};

interface WalletData extends ProtocolData {
  total: Record<WalletDataComponentEnum, number>;
  data: Record<WalletDataComponentEnum, WalletTokenItem[]>;
}

interface HexData extends ProtocolData {
  total: Record<HexDataComponentEnum, number>;
  data: Record<keyof typeof HexDataComponentEnum, HexTokenItem[]>;
}

interface PhiatData extends ProtocolData {
  total: {
    TPLS: number;
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

// export type AnyProtocolData = WalletData | HexData | PhiatData | PulsexData | PancakeData;

// // Action payload interfaces
// export interface AddToProtocolTotalPayload {
//   name: ProtocolEnum;
//   amount: number;
// }
