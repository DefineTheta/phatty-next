import { RootState } from '@app-src/store/store';
import { WalletTokenItem } from '@app-src/types/api';
import memoize from 'proxy-memoize';

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
