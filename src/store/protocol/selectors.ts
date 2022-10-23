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
