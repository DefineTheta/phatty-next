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

export const selectCurrentPublicBundleAddresses = memoize((state: RootState) => {
  if (!state.bundle.currentPublicBundle) return [];

  return state.bundle.currentPublicBundle.addresses;
});

export const selectCurrentPublicBundleName = memoize((state: RootState) => {
  if (!state.bundle.currentPublicBundle) return '';

  return state.bundle.currentPublicBundle.name;
});

export const selectPublicBundles = memoize((state: RootState) => {
  return state.bundle.publicBundles;
});
