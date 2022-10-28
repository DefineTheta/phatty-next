import { RootState } from '@app-src/store/store';
import {
  HexTokenItem,
  PancakeFarmTokenItem,
  PancakeLPTokenItem,
  PhiatTokenItem,
  PulsexTokenItem,
  WalletTokenItem
} from '@app-src/types/api';
import memoize from 'proxy-memoize';
import { HexDataComponentEnum, PhiatDataComponentEnum } from './types';

export const selectWalletData = memoize((state: RootState): WalletTokenItem[] => {
  console.log('SELECT_WALLET_DATA');

  return Array.prototype.concat.apply(
    [],
    [
      state.protocols.WALLET.data.ETHEREUM,
      state.protocols.WALLET.data.TPLS,
      state.protocols.WALLET.data.BSC
    ]
  );
});

export const selectHexStakeData = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): HexTokenItem[] => {
    console.log(`SELECT_${chain}_HEX_STAKE_DATA`);

    return Array.prototype.concat.apply([], state.protocols.HEX.data[chain]);
  });

export const selectPhiatComponentData = (component: keyof typeof PhiatDataComponentEnum) =>
  memoize((state: RootState): PhiatTokenItem[] => {
    console.log(`SELECT_${component}_PHIAT_DATA`);

    return state.protocols.PHIAT.data[component];
  });

export const selectPhiatStakingAPY = memoize((state: RootState) => {
  console.log('SELECT_PHIAT_STAKING_APY');

  return state.protocols.PHIAT.data.STAKING_APY;
});

export const selectPulsexLiquidityPoolData = memoize((state: RootState): PulsexTokenItem[] => {
  console.log('SELECT_PULSEX_LIQUIDITY_POOL_DATA');

  return Array.prototype.concat.apply([], state.protocols.PULSEX.data.LIQUIDITY_POOL);
});

export const selectPancakeFarmingData = memoize((state: RootState): PancakeFarmTokenItem[] => {
  console.log('SELECT_PANCAKE_FARM_DATA');

  return state.protocols.PANCAKE.data.FARMING;
});

export const selectPancakeLiquidityPoolData = memoize((state: RootState): PancakeLPTokenItem[] => {
  console.log('SELECT_PANCAKE_LIQUIDITY_POOL_DATA');

  return state.protocols.PANCAKE.data.LIQUIDITY_POOL;
});

export const selectEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return state.protocols.WALLET.total.ETHEREUM + state.protocols.HEX.total.ETHEREUM;
});

export const selectBscTotal = memoize((state: RootState): number => {
  console.log('SELECT_BSC_TOTAL');

  return state.protocols.WALLET.total.BSC + selectPancakeTotal(state);
});

export const selectTplsTotal = memoize((state: RootState): number => {
  console.log('SELECT_TPLS_TOTAL');

  return (
    state.protocols.WALLET.total.TPLS +
    state.protocols.HEX.total.TPLS +
    selectPhiatTotal(state) +
    selectPulsexTotal(state)
  );
});

export const selectWalletTotal = memoize((state: RootState): number => {
  console.log('SELECT_WALLET_TOTAL');

  return (
    state.protocols.WALLET.total.ETHEREUM +
    state.protocols.WALLET.total.BSC +
    state.protocols.WALLET.total.TPLS
  );
});

export const selectHexComponentTotal = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEX_STAKE_TOTAL`);

    return state.protocols.HEX.total[chain];
  });

export const selectHextotal = memoize((state: RootState): number => {
  console.log('SELECT_HEX_TOTAL');

  return selectHexComponentTotal('ETHEREUM')(state) + selectHexComponentTotal('TPLS')(state);
});

export const selectPhiatTotal = memoize((state: RootState): number => {
  console.log('SELECT_PHIAT_TOTAL');

  return state.protocols.PHIAT.total.TPLS;
});

export const selectPulsexTotal = memoize((state: RootState): number => {
  console.log('SELECT_PULSEX_TOTAL');

  return state.protocols.PULSEX.total.LIQUIDITY_POOL;
});

export const selectPancakeTotal = memoize((state: RootState): number => {
  console.log('SELECT_PANCAKE_TOTAL');

  return state.protocols.PANCAKE.total.LIQUIDITY_POOL + state.protocols.PANCAKE.total.FARMING;
});

export const selectTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return selectEthereumTotal(state) + selectBscTotal(state) + selectTplsTotal(state);
});

export const selectWalletLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_WALLET_LOADING');

  return state.protocols.WALLET.loading;
});

export const selectHexStakeLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_HEX_STAKE_LOADING');

  return state.protocols.HEX.loading;
});

export const selectPhiatLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PHIAT_LOADING');

  return state.protocols.PHIAT.loading;
});

export const selectPulsexLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PULSEX_LOADING');

  return state.protocols.PULSEX.loading;
});

export const selectPancakeLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PANCAKE_LOADING');

  return state.protocols.PANCAKE.loading;
});
