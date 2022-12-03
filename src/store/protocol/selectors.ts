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
  WalletTokenItem,
  XenMintItem,
  XenStakeItem
} from '@app-src/types/api';
import memoize from 'proxy-memoize';
import {
  Chain,
  ChainEnum,
  HedronDataComponentEnum,
  HexDataComponentEnum,
  PhamousDataComponent,
  PhiatDataComponentEnum,
  XenDataComponent
} from './types';

export const selectProfileHasFetched = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HAS_FETCHED');

  return state.protocols.hasFetched;
});

export const selectProfileAddress = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_ADDRESS');

  return state.protocols.address;
});

export const selectWalletData = (chains: Chain[]) =>
  memoize((state: RootState): WalletTokenItem[] => {
    console.log('SELECT_WALLET_DATA');

    if (chains.length === 0)
      return Array.prototype.concat.apply(
        [],
        [
          state.protocols.WALLET.data.ETH,
          state.protocols.WALLET.data.TPLS,
          state.protocols.WALLET.data.BSC,
          state.protocols.WALLET.data.MATIC,
          state.protocols.WALLET.data.AVAX,
          state.protocols.WALLET.data.FTM
        ]
      );

    return chains.reduce((data, chain) => {
      return [...data, ...state.protocols.WALLET.data[chain]];
    }, [] as WalletTokenItem[]);
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

export const selectProfileHedronStakeData = (chain: keyof typeof HedronDataComponentEnum) =>
  memoize((state: RootState): HedronItem[] => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_DATA`);

    return state.protocols.HEDRON.data[chain];
  });

export const selectProfilePhamousComponentData = (component: PhamousDataComponent) =>
  memoize((state: RootState): PhamousItem[] => {
    console.log(`SELECT_${component}_PHAMOUS_DATA`);

    return state.protocols.PHAMOUS.data[component];
  });

// export const selectProfileXenComponentData = <T>(component: XenDataComponent) =>
//   memoize(
//     (
//       state: RootState
//     ): T extends Extract<XenDataComponent, 'STAKING'> ? XenStakeItem[] : XenMintItem[] => {
//       console.log(`SELECT_${component}_XEN_DATA`);

//       type a = typeof component;

//       return state.protocols.XEN.data[component];
//     }
//   );

export function selectProfileXenComponentData(
  component: Extract<XenDataComponent, 'STAKING'>
): (state: RootState) => XenStakeItem[];
export function selectProfileXenComponentData(
  component: Extract<XenDataComponent, 'MINTING'>
): (state: RootState) => XenMintItem[];

export function selectProfileXenComponentData(component: XenDataComponent) {
  return memoize((state: RootState) => {
    console.log(`SELECT_${component}_XEN_DATA`);

    return state.protocols.XEN.data[component];
  });
}

export const selectEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return (
    getPositiveOrZero(state.protocols.WALLET.total.ETH) +
    getPositiveOrZero(state.protocols.HEX.total.ETH) +
    getPositiveOrZero(state.protocols.SUSHI.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.protocols.UNISWAPV2.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.protocols.UNISWAPV3.total.LIQUIDITY_POOL) +
    getPositiveOrZero(state.protocols.HEDRON.total.ETH) +
    getPositiveOrZero(state.protocols.XEN.total.ETH)
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
    getPositiveOrZero(selectPulsexTotal(state)) +
    getPositiveOrZero(state.protocols.HEDRON.total.TPLS) +
    getPositiveOrZero(state.protocols.PHAMOUS.total.TPLS)
  );
});

export const selectMaticTotal = memoize((state: RootState): number => {
  console.log('SELECT_MATIC_TOTAL');

  return getPositiveOrZero(state.protocols.WALLET.total.MATIC);
});

export const selectAvaxTotal = memoize((state: RootState): number => {
  console.log('SELECT_AVAX_TOTAL');

  return getPositiveOrZero(state.protocols.WALLET.total.AVAX);
});

export const selectProfileFtmTotal = memoize((state: RootState): number => {
  console.log('SELECT_PROFILE_FTM_TOTAL');

  return getPositiveOrZero(state.protocols.WALLET.total.FTM);
});

export const selectWalletTotal = (chains: Chain[]) =>
  memoize((state: RootState): number => {
    console.log('SELECT_WALLET_TOTAL');

    if (chains.length === 0) {
      return (
        state.protocols.WALLET.total.ETH +
        state.protocols.WALLET.total.BSC +
        state.protocols.WALLET.total.TPLS +
        state.protocols.WALLET.total.MATIC +
        state.protocols.WALLET.total.AVAX +
        state.protocols.WALLET.total.FTM
      );
    }

    return chains.reduce((total, chain) => total + state.protocols.WALLET.total[chain], 0);
  });

export const selectHexComponentTotal = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEX_STAKE_TOTAL`);

    return state.protocols.HEX.total[chain];
  });

export const selectHextotal = memoize((state: RootState): number => {
  console.log('SELECT_HEX_TOTAL');

  return selectHexComponentTotal('ETH')(state) + selectHexComponentTotal('TPLS')(state);
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

export const selectProfileHedronComponentTotal = (chain: keyof typeof HedronDataComponentEnum) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_TOTAL`);

    return state.protocols.HEDRON.total[chain];
  });

export const selectProfileHedronTotal = memoize((state: RootState): number => {
  console.log('SELECT_PROFILE_HEDRON_TOTAL');

  return state.protocols.HEDRON.total.ETH + state.protocols.HEDRON.total.TPLS;
});

export const selectProfilePhamousTotal = memoize((state: RootState): number => {
  console.log('SELECT_PROFILE_PHAMOUS_TOTAL');

  return state.protocols.PHAMOUS.total.TPLS;
});

export const selectProfileXenTotal = memoize((state: RootState): number => {
  console.log('SELECT_PROFILE_XEN_TOTAL');

  return state.protocols.XEN.total.ETH;
});

export const selectTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return (
    selectEthereumTotal(state) +
    selectBscTotal(state) +
    selectTplsTotal(state) +
    selectMaticTotal(state) +
    selectAvaxTotal(state) +
    selectProfileFtmTotal(state)
  );
});

export const selectProfileChainsTotal = (chains: Chain[]) =>
  memoize((state: RootState): number => {
    console.log('SELECT_PROFILE_CHAINS_TOTAL');

    if (!chains || chains.length === 0) return selectTotal(state);

    const selectChaintotal = (chain: Chain) => {
      switch (chain) {
        case ChainEnum.ETH:
          return selectEthereumTotal(state);
        case ChainEnum.BSC:
          return selectBscTotal(state);
        case ChainEnum.TPLS:
          return selectTplsTotal(state);
        case ChainEnum.MATIC:
          return selectMaticTotal(state);
        case ChainEnum.AVAX:
          return selectAvaxTotal(state);
        case ChainEnum.FTM:
          return selectProfileFtmTotal(state);
      }
    };

    return chains.reduce((total, chain) => total + selectChaintotal(chain), 0);
  });

export const selectHexToatlTSharesPercentage = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState) => {
    console.log('SELECT_HEX_TOTAL_T_SHARES_PERCENTAGE');

    return getSeaCreature(state.protocols.HEX.totalTSharesPercentage[chain]);
  });

export const selectPhiatTotalTSharesPercentage = memoize((state: RootState) => {
  console.log('SELECT_PHAIT_TOTAL_T_SHARES_PERCENTAGE');

  const TOTAL_NUM_OF_PHIAT_STAKES = 55555000;

  return getSeaCreature((state.protocols.PHIAT.balance.STAKING / TOTAL_NUM_OF_PHIAT_STAKES) * 100);
});

export const selectProfilePhamousTotalTSharesPercentage = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_PHAMOUS_TOTAL_T_SHARES_PERCENTAGE');

  const TOTAL_NUM_OF_PHAMOUS_STAKES = 55555000;

  return getSeaCreature(
    (state.protocols.PHAMOUS.balance.STAKING / TOTAL_NUM_OF_PHAMOUS_STAKES) * 100
  );
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

export const selectProfileHedronLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_HEDRON_LOADING');

  return state.protocols.HEDRON.loading;
});

export const selectProfilePhamousLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_PHAMOUS_LOADING');

  return state.protocols.PHAMOUS.loading;
});

export const selectProfileXenLoading = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_XEN_LOADING');

  return state.protocols.XEN.loading;
});

export const selectProfileWalletError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_WALLET_ERROR');

  return state.protocols.WALLET.error;
});

export const selectProfileHexError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_HEX_ERROR');

  return state.protocols.HEX.error;
});

export const selectProfilePhiatError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_PHIAT_ERROR');

  return state.protocols.PHIAT.error;
});

export const selectProfilePulsexError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_PULSEX_ERROR');

  return state.protocols.PULSEX.error;
});

export const selectProfilePancakeError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_PANCAKE_ERROR');

  return state.protocols.PANCAKE.error;
});

export const selectProfileSushiError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_SUSHI_ERROR');

  return state.protocols.SUSHI.error;
});

export const selectProfileUniV2Error = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_UNISWAPV2_ERROR');

  return state.protocols.UNISWAPV2.error;
});

export const selectProfileUniV3Error = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_UNISWAPV3_ERROR');

  return state.protocols.UNISWAPV3.error;
});

export const selectProfileHedronError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_HEDRON_ERROR');

  return state.protocols.HEDRON.error;
});

export const selectProfilePhamousError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_PHAMOUS_ERROR');

  return state.protocols.PHAMOUS.error;
});

export const selectProfileXenError = memoize((state: RootState): boolean => {
  console.log('SELECT_PROFILE_XEN_ERROR');

  return state.protocols.XEN.error;
});
