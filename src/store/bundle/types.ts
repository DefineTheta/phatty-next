import { Bundle } from '@app-src/server/bundle';

export type BundleState = {
  bundlesIndex: { [k: string]: number };
  bundles: Bundle[];
  currentBundle: Bundle | null;
};
