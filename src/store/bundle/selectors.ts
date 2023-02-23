import memoize from 'proxy-memoize';
import { RootState } from '../store';

export const selectBundles = memoize((state: RootState) => {
  return state.bundle.bundles;
});

export const selectBundle = (bundleId: string) =>
  memoize((state: RootState) => {
    const index = state.bundle.bundlesIndex[bundleId];
    return state.bundle.bundles[index];
  });

export const selectCurrentBundleAddresses = memoize((state: RootState) => {
  if (!state.bundle.currentBundle) return [];

  return state.bundle.currentBundle.addresses;
});
