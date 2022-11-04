import { getPositiveOrZero } from '@app-src/common/utils/query';
import { getSeaCreature } from '@app-src/services/api';
import { RootState } from '@app-src/store/store';
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
import memoize from 'proxy-memoize';
import { HexDataComponentEnum, PhiatDataComponentEnum } from './types';

export const selectProfileHasFetched = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HAS_FETCHED');

  return state.protocols.hasFetched;
});

export const selectProfileAddress = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_ADDRESS');

  return state.protocols.address;
});

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

export const selectSushiLiquidityPoolData = memoize((state: RootState): SushiItem[] => {
  console.log('SELECT_SUSHI_LIQUIDITY_POOL_DATA');

  return state.protocols.SUSHI.data.LIQUIDITY_POOL;
});

export const selectUniV2LiquidityPoolData = memoize((state: RootState): UniV2Item[] => {
  console.log('SELECT_UNIV2_LIQUIDITY_POOL_DATA');

  return state.protocols.UNISWAPV2.data.LIQUIDITY_POOL;
});

export const selectUniV3LiquidityPoolData = memoize((state: RootState): UniV3Item[] => {
  console.log('SELECT_UNIV3_LIQUIDITY_POOL_DATA');

  return state.protocols.UNISWAPV3.data.LIQUIDITY_POOL;
});

export const selectEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return (
    getPositiveOrZero(state.protocols.WALLET.total.ETHEREUM) +
    getPositiveOrZero(state.protocols.HEX.total.ETHEREUM) +
    getPositiveOrZero(state.protocols.SUSHI.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.protocols.UNISWAPV2.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.protocols.UNISWAPV3.total.LIQUIDITY_POOL)
  );
});

export const selectBscTotal = memoize((state: RootState): number => {
  console.log('SELECT_BSC_TOTAL');

  return (
    getPositiveOrZero(state.protocols.WALLET.total.BSC) +
    getPositiveOrZero(selectPancakeTotal(state))
  );
});

export const selectTplsTotal = memoize((state: RootState): number => {
  console.log('SELECT_TPLS_TOTAL');

  return (
    getPositiveOrZero(state.protocols.WALLET.total.TPLS) +
    getPositiveOrZero(state.protocols.HEX.total.TPLS) +
    getPositiveOrZero(selectPhiatTotal(state)) +
    getPositiveOrZero(selectPulsexTotal(state))
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

export const selectSushiTotal = memoize((state: RootState): number => {
  console.log('SELECT_SUSHI_TOTAL');

  return state.protocols.SUSHI.total.LIQUIDITY_POOL;
});

export const selectUniV2Total = memoize((state: RootState): number => {
  console.log('SELECT_UNIV2_TOTAL');

  return state.protocols.UNISWAPV2.total.LIQUIDITY_POOL;
});

export const selectUniV3Total = memoize((state: RootState): number => {
  console.log('SELECT_UNIV3_TOTAL');

  return state.protocols.UNISWAPV3.total.LIQUIDITY_POOL;
});

export const selectTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return selectEthereumTotal(state) + selectBscTotal(state) + selectTplsTotal(state);
});

export const selectHexToatlTSharesPercentage = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState) => {
    console.log('SELECT_HEX_TOTAL_T_SHARES_PERCENTAGE');

    return getSeaCreature(state.protocols.HEX.totalTSharesPercentage[chain]);
  });

export const selectPhiatTotalTSharesPercentage = memoize((state: RootState) => {
  console.log('SELECT_PHAT_TOTAL_T_SHARES_PERCENTAGE');

  const TOTAL_NUM_OF_PHIAT_STAKES = 55555000;

  return getSeaCreature((state.protocols.PHIAT.balance.STAKING / TOTAL_NUM_OF_PHIAT_STAKES) * 100);
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

export const selectSushiLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_SUSHI_LOADING');

  return state.protocols.SUSHI.loading;
});

export const selectUniV2Loading = memoize((state: RootState): boolean => {
  console.log('SELECT_UNIV2_LOADING');

  return state.protocols.UNISWAPV2.loading;
});

export const selectUniV3Loading = memoize((state: RootState): boolean => {
  console.log('SELECT_UNIV3_LOADING');

  return state.protocols.UNISWAPV3.loading;
});

export const selectWalletError = memoize((state: RootState): boolean => {
  console.log('SELECT_WALLET_ERROR');

  return state.protocols.WALLET.error;
});
