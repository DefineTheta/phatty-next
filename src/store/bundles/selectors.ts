import { getPositiveOrZero } from '@app-src/common/utils/query';
import { getSeaCreature } from '@app-src/services/api';
import { RootState } from '@app-src/store/store';
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
  WalletTokenItem
} from '@app-src/types/api';
import memoize from 'proxy-memoize';
import {
  HedronDataComponentEnum,
  HexDataComponentEnum,
  PhamousDataComponent,
  PhiatDataComponentEnum,
  WalletDataComponentEnum
} from './types';

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

export const selectBundleWalletData = (chain: '' | keyof typeof WalletDataComponentEnum) =>
  memoize((state: RootState): WalletTokenItem[] => {
    console.log('SELECT_WALLET_DATA');

    if (!chain)
      return Array.prototype.concat.apply(
        [],
        [
          state.bundles.WALLET.data.ETH,
          state.bundles.WALLET.data.TPLS,
          state.bundles.WALLET.data.BSC,
          state.bundles.WALLET.data.MATIC,
          state.bundles.WALLET.data.AVAX
        ]
      );
    else return state.bundles.WALLET.data[chain];
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

export const selectBundleUniV2LiquidityPoolData = memoize((state: RootState): UniV2Item[] => {
  console.log('SELECT_UNIV2_LIQUIDITY_POOL_DATA');

  return state.bundles.UNISWAPV2.data.LIQUIDITY_POOL;
});

export const selectBundleUniV3LiquidityPoolData = memoize((state: RootState): UniV3Item[] => {
  console.log('SELECT_UNIV3_LIQUIDITY_POOL_DATA');

  return state.bundles.UNISWAPV3.data.LIQUIDITY_POOL;
});

export const selectBundleHedronStakeData = (chain: keyof typeof HedronDataComponentEnum) =>
  memoize((state: RootState): HedronItem[] => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_DATA`);

    return state.bundles.HEDRON.data[chain];
  });

export const selectBundlePhamousComponentData = (component: PhamousDataComponent) =>
  memoize((state: RootState): PhamousItem[] => {
    console.log(`SELECT_${component}_PHAMOUS_DATA`);

    return state.bundles.PHAMOUS.data[component];
  });

export const selectBundleEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return (
    getPositiveOrZero(state.bundles.WALLET.total.ETH) +
    getPositiveOrZero(state.bundles.HEX.total.ETH) +
    getPositiveOrZero(state.bundles.SUSHI.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.bundles.UNISWAPV2.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.bundles.UNISWAPV3.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.bundles.HEDRON.total.ETH)
  );
});

export const selectBundleBscTotal = memoize((state: RootState): number => {
  console.log('SELECT_BSC_TOTAL');

  return (
    getPositiveOrZero(state.bundles.WALLET.total.BSC) +
    getPositiveOrZero(selectBundlePancakeTotal(state))
  );
});

export const selectBundleTplsTotal = memoize((state: RootState): number => {
  console.log('SELECT_TPLS_TOTAL');

  return (
    getPositiveOrZero(state.bundles.WALLET.total.TPLS) +
    getPositiveOrZero(state.bundles.HEX.total.TPLS) +
    getPositiveOrZero(selectBundlePhiatTotal(state)) +
    getPositiveOrZero(selectBundlePulsexTotal(state)) +
    getPositiveOrZero(state.bundles.HEDRON.total.TPLS) +
    getPositiveOrZero(state.bundles.PHAMOUS.total.TPLS)
  );
});

export const selectBundleMaticTotal = memoize((state: RootState): number => {
  console.log('SELECT_BUNDLE_MATIC_TOTAL');

  return getPositiveOrZero(state.bundles.WALLET.total.MATIC);
});

export const selectBundleAvaxTotal = memoize((state: RootState): number => {
  console.log('SELECT_BUNDLE_AVAX_TOTAL');

  return getPositiveOrZero(state.bundles.WALLET.total.AVAX);
});

export const selectBundleWalletTotal = (chain: '' | keyof typeof WalletDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log('SELECT_BUNDLE_WALLET_TOTAL');

    switch (chain) {
      case WalletDataComponentEnum.ETH:
        return state.bundles.WALLET.total.ETH;
      case WalletDataComponentEnum.BSC:
        return state.bundles.WALLET.total.BSC;
      case WalletDataComponentEnum.TPLS:
        return state.bundles.WALLET.total.TPLS;
      case WalletDataComponentEnum.MATIC:
        return state.bundles.WALLET.total.MATIC;
      case WalletDataComponentEnum.AVAX:
        return state.bundles.WALLET.total.AVAX;
      default:
        return (
          state.bundles.WALLET.total.ETH +
          state.bundles.WALLET.total.BSC +
          state.bundles.WALLET.total.TPLS +
          state.bundles.WALLET.total.MATIC +
          state.bundles.WALLET.total.AVAX
        );
    }
  });

export const selectBundleHexComponentTotal = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEX_STAKE_TOTAL`);

    return state.bundles.HEX.total[chain];
  });

export const selectBundleHextotal = memoize((state: RootState): number => {
  console.log('SELECT_HEX_TOTAL');

  return selectBundleHexComponentTotal('ETH')(state) + selectBundleHexComponentTotal('TPLS')(state);
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

export const selectBundleUniV2Total = memoize((state: RootState): number => {
  console.log('SELECT_UNIV2_TOTAL');

  return state.bundles.UNISWAPV2.total.LIQUIDITY_POOL;
});

export const selectBundleUniV3Total = memoize((state: RootState): number => {
  console.log('SELECT_UNIV3_TOTAL');

  return state.bundles.UNISWAPV3.total.LIQUIDITY_POOL;
});

export const selectBundleHedronComponentTotal = (chain: keyof typeof HedronDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_TOTAL`);

    return state.bundles.HEDRON.total[chain];
  });

export const selectBundleHedrontotal = memoize((state: RootState): number => {
  console.log('SELECT_HEDRON_TOTAL');

  return (
    selectBundleHedronComponentTotal('ETH')(state) + selectBundleHedronComponentTotal('TPLS')(state)
  );
});

export const selectBundlePhamousTotal = memoize((state: RootState): number => {
  console.log('SELECT_BUNDLE_PHAMOUS_TOTAL');

  return state.bundles.PHAMOUS.total.TPLS;
});

export const selectBundleTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return (
    selectBundleEthereumTotal(state) +
    selectBundleBscTotal(state) +
    selectBundleTplsTotal(state) +
    selectBundleMaticTotal(state) +
    selectBundleAvaxTotal(state)
  );
});

export const selectBundleHexToatlTSharesPercentage = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState) => {
    console.log('SELECT_BUNDLE_HEX_TOTAL_T_SHARES_PERCENTAGE');

    return getSeaCreature(state.bundles.HEX.totalTSharesPercentage[chain]);
  });

export const selectBundlePhiatTotalTSharesPercentage = memoize((state: RootState) => {
  console.log('SELECT_BUNDLE_PHIAT_TOTAL_T_SHARES_PERCENTAGE');

  const TOTAL_NUM_OF_PHIAT_STAKES = 55555000;

  return getSeaCreature((state.bundles.PHIAT.balance.STAKING / TOTAL_NUM_OF_PHIAT_STAKES) * 100);
});

export const selectBundlePhamousTotalTSharesPercentage = memoize((state: RootState) => {
  console.log('SELECT_BUNDLE_PHAMOUS_TOTAL_T_SHARES_PERCENTAGE');

  const TOTAL_NUM_OF_PHAMOUS_STAKES = 55555000;

  return getSeaCreature(
    (state.bundles.PHAMOUS.balance.STAKING / TOTAL_NUM_OF_PHAMOUS_STAKES) * 100
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

export const selectBundleUniV2Loading = memoize((state: RootState): boolean => {
  console.log('SELECT_UNIV2_LOADING');

  return state.bundles.UNISWAPV2.loading;
});

export const selectBundleUniV3Loading = memoize((state: RootState): boolean => {
  console.log('SELECT_UNIV3_LOADING');

  return state.bundles.UNISWAPV3.loading;
});

export const selectBundleHedronLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_HEDRON_LOADING');

  return state.bundles.HEDRON.loading;
});

export const selectBundlePhamousLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PHAMOUS_LOADING');

  return state.bundles.PHAMOUS.loading;
});

export const selectBundleWalletError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_WALLET_ERROR');

  return state.bundles.WALLET.error;
});

export const selectBundleHexError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_HEX_ERROR');

  return state.bundles.HEX.error;
});

export const selectBundlePhiatError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_PHIAT_ERROR');

  return state.bundles.PHIAT.error;
});

export const selectBundlePulsexError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_PULSEX_ERROR');

  return state.bundles.PULSEX.error;
});

export const selectBundlePancakeError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_PANCAKE_ERROR');

  return state.bundles.PANCAKE.error;
});

export const selectBundleSushiError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_SUSHI_ERROR');

  return state.bundles.SUSHI.error;
});

export const selectBundleUniV2Error = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_UNISWAPV2_ERROR');

  return state.bundles.UNISWAPV2.error;
});

export const selectBundleUniV3Error = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_UNISWAPV3_ERROR');

  return state.bundles.UNISWAPV3.error;
});

export const selectBundleHedronError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_HEDRON_ERROR');

  return state.bundles.HEDRON.error;
});

export const selectBundlePhamousError = memoize((state: RootState): boolean => {
  console.log('SELECT_BUNDLE_PHAMOUS_ERROR');

  return state.bundles.PHAMOUS.error;
});
