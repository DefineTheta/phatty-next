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
  Portfolio,
  XenDataComponent
} from './types';

export const selectHasFetched = (type?: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELCT_HAS_FETCHED');
    if (!type) return false;

    return state.portfolio[type].hasFetched;
  });

export const selectDisplayAddress = (type: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELECT_DISPLAY_ADDRESS');

    return state.portfolio[type].displayAddress;
  });

export const selectAddresses = (type: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELECT_ADDRESSES');

    return state.portfolio[type].addresses;
  });

export const selectWalletData = (chains: Chain[], type: Portfolio) =>
  memoize((state: RootState): WalletTokenItem[] => {
    console.log('SELECT_WALLET_DATA');

    if (chains.length === 0)
      return Array.prototype.concat.apply(
        [],
        [
          state.portfolio[type].WALLET.data.ETH,
          state.portfolio[type].WALLET.data.TPLS,
          state.portfolio[type].WALLET.data.BSC,
          state.portfolio[type].WALLET.data.MATIC,
          state.portfolio[type].WALLET.data.AVAX,
          state.portfolio[type].WALLET.data.FTM
        ]
      );

    return chains.reduce((data, chain) => {
      return [...data, ...state.portfolio[type].WALLET.data[chain]];
    }, [] as WalletTokenItem[]);
  });

export const selectHexStakeData = (chain: keyof typeof HexDataComponentEnum, type: Portfolio) =>
  memoize((state: RootState): HexTokenItem[] => {
    console.log(`SELECT_${chain}_HEX_STAKE_DATA`);

    return state.portfolio[type].HEX.data[chain];
  });

export const selectPhiatComponentData = (
  component: keyof typeof PhiatDataComponentEnum,
  type: Portfolio
) =>
  memoize((state: RootState): PhiatTokenItem[] => {
    console.log(`SELECT_${component}_PHIAT_DATA`);

    return state.portfolio[type].PHIAT.data[component];
  });

export const selectPhiatStakingAPY = (type: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELECT_PHIAT_STAKING_APY');

    return state.portfolio[type].PHIAT.data.STAKING_APY;
  });

export const selectPulsexLiquidityPoolData = (type: Portfolio) =>
  memoize((state: RootState): PulsexTokenItem[] => {
    console.log('SELECT_PULSEX_LIQUIDITY_POOL_DATA');

    return Array.prototype.concat.apply([], state.portfolio[type].PULSEX.data.LIQUIDITY_POOL);
  });

export const selectPancakeFarmingData = (type: Portfolio) =>
  memoize((state: RootState): PancakeFarmTokenItem[] => {
    console.log('SELECT_PANCAKE_FARM_DATA');

    return state.portfolio[type].PANCAKE.data.FARMING;
  });

export const selectPancakeLiquidityPoolData = (type: Portfolio) =>
  memoize((state: RootState): PancakeLPTokenItem[] => {
    console.log('SELECT_PANCAKE_LIQUIDITY_POOL_DATA');

    return state.portfolio[type].PANCAKE.data.LIQUIDITY_POOL;
  });

export const selectSushiLiquidityPoolData = (type: Portfolio) =>
  memoize((state: RootState): SushiItem[] => {
    console.log('SELECT_SUSHI_LIQUIDITY_POOL_DATA');

    return state.portfolio[type].SUSHI.data.LIQUIDITY_POOL;
  });

export const selectUniV2LiquidityPoolData = (type: Portfolio) =>
  memoize((state: RootState): UniV2Item[] => {
    console.log('SELECT_UNIV2_LIQUIDITY_POOL_DATA');

    return state.portfolio[type].UNISWAPV2.data.LIQUIDITY_POOL;
  });

export const selectUniV3LiquidityPoolData = (type: Portfolio) =>
  memoize((state: RootState): UniV3Item[] => {
    console.log('SELECT_UNIV3_LIQUIDITY_POOL_DATA');

    return state.portfolio[type].UNISWAPV3.data.LIQUIDITY_POOL;
  });

export const selectHedronStakeData = (
  chain: keyof typeof HedronDataComponentEnum,
  type: Portfolio
) =>
  memoize((state: RootState): HedronItem[] => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_DATA`);

    return state.portfolio[type].HEDRON.data[chain];
  });

export const selectPhamousComponentData = (component: PhamousDataComponent, type: Portfolio) =>
  memoize((state: RootState): PhamousItem[] => {
    console.log(`SELECT_${component}_PHAMOUS_DATA`);

    return state.portfolio[type].PHAMOUS.data[component];
  });

// export const selectBundleXenComponentData = (component: XenDataComponent) =>
//   memoize((state: RootState): XenStakeItem[] | XenMintItem[] => {
//     console.log(`SELECT_${component}_XEN_DATA`);

//     return state.portfolio[type].XEN.data[component];
//   });

export function selectXenComponentData(
  component: Extract<XenDataComponent, 'STAKING'>,
  type: Portfolio
): (state: RootState) => XenStakeItem[];
export function selectXenComponentData(
  component: Extract<XenDataComponent, 'MINTING'>,
  type: Portfolio
): (state: RootState) => XenMintItem[];

export function selectXenComponentData(component: XenDataComponent, type: Portfolio) {
  return memoize((state: RootState) => {
    console.log(`SELECT_${component}_XEN_DATA`);

    return state.portfolio[type].XEN.data[component];
  });
}

export const selectEthereumTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_ETHEREUM_TOTAL');

    return (
      getPositiveOrZero(state.portfolio[type].WALLET.total.ETH) +
      getPositiveOrZero(state.portfolio[type].HEX.total.ETH) +
      getPositiveOrZero(state.portfolio[type].SUSHI.total.LIQUIDITY_POOL) +
      getPositiveOrZero(state.portfolio[type].UNISWAPV2.total.LIQUIDITY_POOL) +
      getPositiveOrZero(state.portfolio[type].UNISWAPV3.total.LIQUIDITY_POOL) +
      getPositiveOrZero(state.portfolio[type].HEDRON.total.ETH) +
      getPositiveOrZero(state.portfolio[type].XEN.total.ETH)
    );
  });

export const selectBscTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_BSC_TOTAL');

    return (
      getPositiveOrZero(state.portfolio[type].WALLET.total.BSC) +
      getPositiveOrZero(selectPancakeTotal(type)(state))
    );
  });

export const selectTplsTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_TPLS_TOTAL');

    return (
      getPositiveOrZero(state.portfolio[type].WALLET.total.TPLS) +
      getPositiveOrZero(state.portfolio[type].HEX.total.TPLS) +
      getPositiveOrZero(selectPhiatTotal(type)(state)) +
      getPositiveOrZero(selectPulsexTotal(type)(state)) +
      getPositiveOrZero(state.portfolio[type].HEDRON.total.TPLS) +
      getPositiveOrZero(state.portfolio[type].PHAMOUS.total.TPLS)
    );
  });

export const selectMaticTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_MATIC_TOTAL');

    return getPositiveOrZero(state.portfolio[type].WALLET.total.MATIC);
  });

export const selectAvaxTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_AVAX_TOTAL');

    return getPositiveOrZero(state.portfolio[type].WALLET.total.AVAX);
  });

export const selectFtmTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_FTM_TOTAL');

    return getPositiveOrZero(state.portfolio[type].WALLET.total.FTM);
  });

export const selectWalletTotal = (chains: Chain[], type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_WALLET_TOTAL');

    if (chains.length === 0) {
      return (
        state.portfolio[type].WALLET.total.ETH +
        state.portfolio[type].WALLET.total.BSC +
        state.portfolio[type].WALLET.total.TPLS +
        state.portfolio[type].WALLET.total.MATIC +
        state.portfolio[type].WALLET.total.AVAX +
        state.portfolio[type].WALLET.total.FTM
      );
    }

    return chains.reduce((total, chain) => total + state.portfolio[type].WALLET.total[chain], 0);
  });

export const selectHexComponentTotal = (
  chain: keyof typeof HexDataComponentEnum,
  type: Portfolio
) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEX_STAKE_TOTAL`);

    return state.portfolio[type].HEX.total[chain];
  });

export const selectHexTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_HEX_TOTAL');

    return (
      selectHexComponentTotal('ETH', type)(state) + selectHexComponentTotal('TPLS', type)(state)
    );
  });

export const selectPhiatTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_PHIAT_TOTAL');

    return state.portfolio[type].PHIAT.total.TPLS;
  });

export const selectPulsexTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_PULSEX_TOTAL');

    return state.portfolio[type].PULSEX.total.LIQUIDITY_POOL;
  });

export const selectPancakeTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_PANCAKE_TOTAL');

    return (
      state.portfolio[type].PANCAKE.total.LIQUIDITY_POOL +
      state.portfolio[type].PANCAKE.total.FARMING
    );
  });

export const selectSushiTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_SUSHI_TOTAL');

    return state.portfolio[type].SUSHI.total.LIQUIDITY_POOL;
  });

export const selectUniV2Total = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_UNIV2_TOTAL');

    return state.portfolio[type].UNISWAPV2.total.LIQUIDITY_POOL;
  });

export const selectUniV3Total = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_UNIV3_TOTAL');

    return state.portfolio[type].UNISWAPV3.total.LIQUIDITY_POOL;
  });

export const selectHedronComponentTotal = (
  chain: keyof typeof HedronDataComponentEnum,
  type: Portfolio
) =>
  memoize((state: RootState): number => {
    console.log(`SELECT_${chain}_HEDRON_STAKE_TOTAL`);

    return state.portfolio[type].HEDRON.total[chain];
  });

export const selectHedronTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_HEDRON_TOTAL');

    return (
      selectHedronComponentTotal('ETH', type)(state) +
      selectHedronComponentTotal('TPLS', type)(state)
    );
  });

export const selectPhamousTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_PHAMOUS_TOTAL');

    return state.portfolio[type].PHAMOUS.total.TPLS;
  });

export const selectXenTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_XEN_TOTAL');

    return state.portfolio[type].XEN.total.ETH;
  });

export const selectTotal = (type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_TOTAL');

    return (
      selectEthereumTotal(type)(state) +
      selectBscTotal(type)(state) +
      selectTplsTotal(type)(state) +
      selectMaticTotal(type)(state) +
      selectAvaxTotal(type)(state) +
      selectFtmTotal(type)(state)
    );
  });

export const selectChainsTotal = (chains: Chain[], type: Portfolio) =>
  memoize((state: RootState): number => {
    console.log('SELECT_CHAINS_TOTAL');

    if (!chains || chains.length === 0) return selectTotal(type)(state);

    const selectChaintotal = (chain: Chain) => {
      switch (chain) {
        case ChainEnum.ETH:
          return selectEthereumTotal(type)(state);
        case ChainEnum.BSC:
          return selectBscTotal(type)(state);
        case ChainEnum.TPLS:
          return selectTplsTotal(type)(state);
        case ChainEnum.MATIC:
          return selectMaticTotal(type)(state);
        case ChainEnum.AVAX:
          return selectAvaxTotal(type)(state);
        case ChainEnum.FTM:
          return selectFtmTotal(type)(state);
      }
    };

    return chains.reduce((total, chain) => total + selectChaintotal(chain), 0);
  });

export const selectHexToatlTSharesPercentage = (
  chain: keyof typeof HexDataComponentEnum,
  type: Portfolio
) =>
  memoize((state: RootState) => {
    console.log('SELECT_HEX_TOTAL_T_SHARES_PERCENTAGE');

    return getSeaCreature(state.portfolio[type].HEX.totalTSharesPercentage[chain]);
  });

export const selectPhiatTotalTSharesPercentage = (type: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELECT_PHIAT_TOTAL_T_SHARES_PERCENTAGE');

    const TOTAL_NUM_OF_PHIAT_STAKES = 55555000;

    return getSeaCreature(
      (state.portfolio[type].PHIAT.balance.STAKING / TOTAL_NUM_OF_PHIAT_STAKES) * 100
    );
  });

export const selectPhamousTotalTSharesPercentage = (type: Portfolio) =>
  memoize((state: RootState) => {
    console.log('SELECT_PHAMOUS_TOTAL_T_SHARES_PERCENTAGE');

    const TOTAL_NUM_OF_PHAMOUS_STAKES = 55555000;

    return getSeaCreature(
      (state.portfolio[type].PHAMOUS.balance.STAKING / TOTAL_NUM_OF_PHAMOUS_STAKES) * 100
    );
  });

export const selectWalletLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_WALLET_LOADING');

    return state.portfolio[type].WALLET.loading;
  });

export const selectHexStakeLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_HEX_STAKE_LOADING');

    return state.portfolio[type].HEX.loading;
  });

export const selectPhiatLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PHIAT_LOADING');

    return state.portfolio[type].PHIAT.loading;
  });

export const selectPulsexLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PULSEX_LOADING');

    return state.portfolio[type].PULSEX.loading;
  });

export const selectPancakeLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PANCAKE_LOADING');

    return state.portfolio[type].PANCAKE.loading;
  });

export const selectSushiLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_SUSHI_LOADING');

    return state.portfolio[type].SUSHI.loading;
  });

export const selectUniV2Loading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_UNIV2_LOADING');

    return state.portfolio[type].UNISWAPV2.loading;
  });

export const selectUniV3Loading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_UNIV3_LOADING');

    return state.portfolio[type].UNISWAPV3.loading;
  });

export const selectHedronLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_HEDRON_LOADING');

    return state.portfolio[type].HEDRON.loading;
  });

export const selectPhamousLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PHAMOUS_LOADING');

    return state.portfolio[type].PHAMOUS.loading;
  });

export const selectXenLoading = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_XEN_LOADING');

    return state.portfolio[type].XEN.loading;
  });

export const selectWalletError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_WALLET_ERROR');

    return state.portfolio[type].WALLET.error;
  });

export const selectHexError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_HEX_ERROR');

    return state.portfolio[type].HEX.error;
  });

export const selectPhiatError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PHIAT_ERROR');

    return state.portfolio[type].PHIAT.error;
  });

export const selectPulsexError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PULSEX_ERROR');

    return state.portfolio[type].PULSEX.error;
  });

export const selectPancakeError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PANCAKE_ERROR');

    return state.portfolio[type].PANCAKE.error;
  });

export const selectSushiError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_SUSHI_ERROR');

    return state.portfolio[type].SUSHI.error;
  });

export const selectUniV2Error = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_UNISWAPV2_ERROR');

    return state.portfolio[type].UNISWAPV2.error;
  });

export const selectUniV3Error = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_UNISWAPV3_ERROR');

    return state.portfolio[type].UNISWAPV3.error;
  });

export const selectHedronError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_HEDRON_ERROR');

    return state.portfolio[type].HEDRON.error;
  });

export const selectPhamousError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_PHAMOUS_ERROR');

    return state.portfolio[type].PHAMOUS.error;
  });

export const selectXenError = (type: Portfolio) =>
  memoize((state: RootState): boolean => {
    console.log('SELECT_XEN_ERROR');

    return state.portfolio[type].XEN.error;
  });
