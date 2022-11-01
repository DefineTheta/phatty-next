import { RootState } from '@app-src/store/store';
import {
  HexTokenItem,
  PancakeFarmTokenItem,
  PancakeLPTokenItem,
  PhiatTokenItem,
  PulsexTokenItem,
  SushiItem,
  WalletTokenItem
} from '@app-src/types/api';
import memoize from 'proxy-memoize';
import { HexDataComponentEnum, PhiatDataComponentEnum } from './types';

export const selectBundleHasFetched = memoize((state: RootState) => {
  console.log('SELCT_BUNDLE_HAS_FETCHED');

  return state.bundles.hasFetched;
});

export const selectBundleAddress = memoize((state: RootState) => {
  console.log('SELECT_BUNDLE_ADDRESS');

  return state.bundles.bundleAddress;
});

export const selectBundleAddresses = memoize((state: RootState) => {
  console.log('SELECT_BUNDLE_ADDRESSES');

  return state.bundles.addresses;
});

export const selectBundleWalletData = memoize((state: RootState): WalletTokenItem[] => {
  console.log('SELECT_WALLET_DATA');

  return Array.prototype.concat.apply(
    [],
    [
      state.bundles.WALLET.data.ETHEREUM,
      state.bundles.WALLET.data.TPLS,
      state.bundles.WALLET.data.BSC
    ]
  );
});

export const selectBundleHexStakeData = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): HexTokenItem[] => {
    console.log(`SELECT_${chain}_HEX_STAKE_DATA`);

    return Array.prototype.concat.apply([], state.bundles.HEX.data[chain]);
  });

export const selectBundlePhiatComponentData = (component: keyof typeof PhiatDataComponentEnum) =>
  memoize((state: RootState): PhiatTokenItem[] => {
    console.log(`SELECT_${component}_PHIAT_DATA`);

    return state.bundles.PHIAT.data[component];
  });

export const selectBundlePhiatStakingAPY = memoize((state: RootState) => {
  console.log('SELECT_PHIAT_STAKING_APY');

  return state.bundles.PHIAT.data.STAKING_APY;
});

export const selectBundlePulsexLiquidityPoolData = memoize(
  (state: RootState): PulsexTokenItem[] => {
    console.log('SELECT_PULSEX_LIQUIDITY_POOL_DATA');

    return Array.prototype.concat.apply([], state.bundles.PULSEX.data.LIQUIDITY_POOL);
  }
);

export const selectBundlePancakeFarmingData = memoize(
  (state: RootState): PancakeFarmTokenItem[] => {
    console.log('SELECT_PANCAKE_FARM_DATA');

    return state.bundles.PANCAKE.data.FARMING;
  }
);

export const selectBundlePancakeLiquidityPoolData = memoize(
  (state: RootState): PancakeLPTokenItem[] => {
    console.log('SELECT_PANCAKE_LIQUIDITY_POOL_DATA');

    return state.bundles.PANCAKE.data.LIQUIDITY_POOL;
  }
);

export const selectBundleSushiLiquidityPoolData = memoize((state: RootState): SushiItem[] => {
  console.log('SELECT_SUSHI_LIQUIDITY_POOL_DATA');

  return state.bundles.SUSHI.data.LIQUIDITY_POOL;
});

export const selectBundleEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return (
    state.bundles.WALLET.total.ETHEREUM +
    state.bundles.HEX.total.ETHEREUM +
    state.bundles.SUSHI.total.LIQUIDITY_POOL
  );
});

export const selectBundleBscTotal = memoize((state: RootState): number => {
  console.log('SELECT_BSC_TOTAL');

  return state.bundles.WALLET.total.BSC + selectBundlePancakeTotal(state);
});

export const selectBundleTplsTotal = memoize((state: RootState): number => {
  console.log('SELECT_TPLS_TOTAL');

  return (
    state.bundles.WALLET.total.TPLS +
    state.bundles.HEX.total.TPLS +
    selectBundlePhiatTotal(state) +
    selectBundlePulsexTotal(state)
  );
});

export const selectBundleWalletTotal = memoize((state: RootState): number => {
  console.log('SELECT_WALLET_TOTAL');

  return (
    state.bundles.WALLET.total.ETHEREUM +
    state.bundles.WALLET.total.BSC +
    state.bundles.WALLET.total.TPLS
  );
});

export const selectBundleHexComponentTotal = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEX_STAKE_TOTAL`);

    return state.bundles.HEX.total[chain];
  });

export const selectBundleHextotal = memoize((state: RootState): number => {
  console.log('SELECT_HEX_TOTAL');

  return (
    selectBundleHexComponentTotal('ETHEREUM')(state) + selectBundleHexComponentTotal('TPLS')(state)
  );
});

export const selectBundlePhiatTotal = memoize((state: RootState): number => {
  console.log('SELECT_PHIAT_TOTAL');

  return state.bundles.PHIAT.total.TPLS;
});

export const selectBundlePulsexTotal = memoize((state: RootState): number => {
  console.log('SELECT_PULSEX_TOTAL');

  return state.bundles.PULSEX.total.LIQUIDITY_POOL;
});

export const selectBundlePancakeTotal = memoize((state: RootState): number => {
  console.log('SELECT_PANCAKE_TOTAL');

  return state.bundles.PANCAKE.total.LIQUIDITY_POOL + state.bundles.PANCAKE.total.FARMING;
});

export const selectBundleSushiTotal = memoize((state: RootState): number => {
  console.log('SELECT_SUSHI_TOTAL');

  return state.bundles.SUSHI.total.LIQUIDITY_POOL;
});

export const selectBundleTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return (
    selectBundleEthereumTotal(state) + selectBundleBscTotal(state) + selectBundleTplsTotal(state)
  );
});

export const selectBundleWalletLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_WALLET_LOADING');

  return state.bundles.WALLET.loading;
});

export const selectBundleHexStakeLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_HEX_STAKE_LOADING');

  return state.bundles.HEX.loading;
});

export const selectBundlePhiatLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PHIAT_LOADING');

  return state.bundles.PHIAT.loading;
});

export const selectBundlePulsexLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PULSEX_LOADING');

  return state.bundles.PULSEX.loading;
});

export const selectBundlePancakeLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PANCAKE_LOADING');

  return state.bundles.PANCAKE.loading;
});

export const selectBundleSushiLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_SUSHI_LOADING');

  return state.bundles.SUSHI.loading;
});
