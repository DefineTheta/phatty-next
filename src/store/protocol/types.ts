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
  UNISWAPV2 = 'UNISWAPV2',
  UNISWAPV3 = 'UNISWAPV3'
}

export enum WalletDataComponentEnum {
  ETHEREUM = 'ETHEREUM',
  TPLS = 'TPLS',
  BSC = 'BSC'
}

export interface ProtocolsState {
  [ProtocolEnum.WALLET]: WalletData;
  // [ProtocolEnum.HEX]: HexData;
  // [ProtocolEnum.PHIAT]: PhiatData;
  // [ProtocolEnum.PULSEX]: PulsexData;
  // [ProtocolEnum.PANCAKE]: PancakeData;
  // [ProtocolEnum.UNISWAPV2]: UniswapV2Data;
  // [ProtocolEnum.UNISWAPV3]: UniswapV3Data;
}

export interface ProtocolData {
  name: ProtocolEnum;
  displayName: string;
  id: string;
  img: ProtocolImgEnum;
  loading: boolean;
  error: boolean;
}

export type WalletResponse = WalletItem[];

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
  data: Record<WalletDataComponentEnum, WalletResponse[]>;
}

// interface HexData extends ProtocolData {
//   total: Record<HexDataComponentEnum, number>;
//   data: Record<keyof typeof HexDataComponentEnum, MappedHexResponse[]>;
// }

// interface PhiatData extends ProtocolData {
//   total: {
//     PHIAT: number;
//   };
//   data: Record<PhiatDataComponentEnum, any[]>;
// }

// interface PulsexData extends ProtocolData {
//   total: Record<PulsexDataComponentEnum, number>;
//   data: Record<keyof typeof PulsexDataComponentEnum, any[]>;
// }

// interface PancakeData extends ProtocolData {
//   total: Record<PancakeDataComponentEnum, number>;
//   data: Record<keyof typeof PancakeDataComponentEnum, any[]>;
// }

// interface UniswapV2Data extends ProtocolData {
//   total: Record<UniswapV2DataComponentEnum, number>;
//   data: Record<keyof typeof UniswapV2DataComponentEnum, UniV2Data>;
// }

// interface UniswapV3Data extends ProtocolData {
//   total: Record<UniswapV3DataComponentEnum, number>;
//   data: Record<keyof typeof UniswapV3DataComponentEnum, UniV3Data>;
// }

// export type AnyProtocolData = WalletData | HexData | PhiatData | PulsexData | PancakeData;

// // Action payload interfaces
// export interface AddToProtocolTotalPayload {
//   name: ProtocolEnum;
//   amount: number;
// }
