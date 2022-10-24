import { RootState } from '@app-src/store/store';
import { HexTokenItem, WalletTokenItem } from '@app-src/types/api';
import memoize from 'proxy-memoize';
import { HexDataComponentEnum } from './types';

export const selectWalletData = memoize((state: RootState): WalletTokenItem[] => {
  console.log('SELECT_WALLET_DATA');

  return Array.prototype.concat.apply(
    [],
    [
      Array.prototype.concat.apply([], state.protocols.WALLET.data.ETHEREUM),
      Array.prototype.concat.apply([], state.protocols.WALLET.data.TPLS),
      Array.prototype.concat.apply([], state.protocols.WALLET.data.BSC)
    ]
  );
});

export const selectHexStakeData = (chain: keyof typeof HexDataComponentEnum) =>
  memoize((state: RootState): HexTokenItem[] => {
    console.log(`SELECT_${chain}_HEX_STAKE_DATA`);

    return Array.prototype.concat.apply([], state.protocols.HEX.data[chain]);
  });

export const selectEthereumTotal = memoize((state: RootState): number => {
  console.log('SELECT_ETHEREUM_TOTAL');

  return state.protocols.WALLET.total.ETHEREUM + state.protocols.HEX.total.ETHEREUM;
});

export const selectBscTotal = memoize((state: RootState): number => {
  console.log('SELECT_BSC_TOTAL');

  return state.protocols.WALLET.total.BSC;
});

export const selectTplsTotal = memoize((state: RootState): number => {
  console.log('SELECT_TPLS_TOTAL');

  return state.protocols.WALLET.total.TPLS + state.protocols.HEX.total.TPLS;
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

export const selectTotal = memoize((state: RootState): number => {
  console.log('SELECT_TOTAL');

  return selectWalletTotal(state) + selectHextotal(state);
});
