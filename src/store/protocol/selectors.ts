// import memoize from 'proxy-memoize';
// import { getCreatureData } from 'src/helpers/crypto';
// import { addObjectValue, sumOfObjectValues } from 'src/helpers/misc';
// import { MappedHexResponse } from 'src/types/api';
// import {
//   HexDataComponentEnum,
//   PancakeDataComponentEnum,
//   PhiatDataComponentEnum,
//   PHIAT_STAKING_CREATURE_DENOMINATOR,
//   ProtocolEnum,
//   WalletDataComponentEnum
// } from 'src/types/crypto';
// import { RootState } from '../store';
// import { AnyProtocolData } from './types';

// export const selectProtocols = memoize((state: RootState): AnyProtocolData[] => {
//   console.log('SELECT_PROTOCOLS');

//   return Object.values(state.protocols);
// });

// export const selectProtocolLoading = (protocol: ProtocolEnum) =>
//   memoize((state: RootState) => {
//     console.log(`SELECT_${protocol}_LOADING`);

//     return state.protocols[protocol].loading;
//   });

// export const selectProtocolError = (protocol: ProtocolEnum) =>
//   memoize((state: RootState) => {
//     console.log(`SELECT_${protocol}_ERROR`);

//     return state.protocols[protocol].error;
//   });

// export const selectAddressTotal = memoize((state: RootState): number => {
//   console.log('SELECT_ADDRESS_TOTAL');

//   return Object.values(state.protocols).reduce(
//     (prev, cur: AnyProtocolData) =>
//       prev + Object.values(cur.total).reduce((prev, cur) => prev + (cur < 0 ? 0 : cur), 0.0),
//     0.0
//   );
// });

// export const selectProtocolTotal = (protocol: ProtocolEnum, chain?: string) =>
//   memoize((state: RootState): number => {
//     console.log(`SELECT_${protocol}_${chain}_TOTAL`);

//     if (chain === undefined) return sumOfObjectValues(state.protocols[protocol].total);

//     //@ts-expect-error
//     return state.protocols[protocol].total[chain];
//   });

// export const selectWalletData = (component?: keyof typeof WalletDataComponentEnum) =>
//   memoize((state: RootState) => {
//     console.log('SELECT_WALLET_DATA');

//     if (component === undefined) {
//       return Array.prototype.concat.apply(
//         [],
//         [
//           Array.prototype.concat.apply([], state.protocols.WALLET.data.ETHEREUM),
//           Array.prototype.concat.apply([], state.protocols.WALLET.data.TPLS),
//           Array.prototype.concat.apply([], state.protocols.WALLET.data.BSC)
//         ]
//       );
//     }

//     return Array.prototype.concat.apply([], state.protocols.WALLET.data[component]);
//   });

// export const selectHexData = (component: HexDataComponentEnum) =>
//   memoize((state: RootState): MappedHexResponse => {
//     console.log('SELECT_HEX_DATA');

//     return Array.prototype.concat.apply([], state.protocols.HEX.data[component]);
//   });

// export const selectPhiatData = (component: PhiatDataComponentEnum) =>
//   memoize((state: RootState) => {
//     console.log('SELECT_PHIAT_DATA');

//     return Array.prototype.concat.apply([], state.protocols.PHIAT.data[component]);
//   });

// export const selectPulsexData = memoize((state: RootState) => {
//   console.log('SELECT_PULSEX_DATA');

//   return Array.prototype.concat.apply([], state.protocols.PULSEX.data.PULSEX);
// });

// export const selectPancakeData = memoize((state: RootState) => {
//   console.log('SELECT_PANCAKE_DATA');

//   return {
//     [PancakeDataComponentEnum.FARMING]: Array.prototype.concat.apply(
//       [],
//       state.protocols.PANCAKE.data.FARMING
//     ),
//     [PancakeDataComponentEnum.LIQUIDITY_POOL]: Array.prototype.concat.apply(
//       [],
//       state.protocols.PANCAKE.data.LIQUIDITY_POOL
//     )
//   };
// });

// export const selectHexCreatureData = (component: HexDataComponentEnum) =>
//   memoize((state: RootState) => {
//     console.log(`SELECT_${component}_HEX_CREATURE_DATA`);

//     const totalPercentage =
//       selectHexData(component)(state).reduce((prev, cur) => prev + cur.tSharesP, 0.0) * 100;

//     return getCreatureData(totalPercentage);
//   });

// export const selectPhiatStakingCreatureData = memoize((state: RootState) => {
//   console.log('SELECT_PHIAT_STAKING_CREATURE_DATA');

//   const totalPercentage =
//     addObjectValue(selectPhiatData(PhiatDataComponentEnum.PHIAT_STAKING)(state), 'balance') /
//     PHIAT_STAKING_CREATURE_DENOMINATOR;

//   return getCreatureData(totalPercentage);
// });
