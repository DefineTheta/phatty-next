import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import {
  fetchBundleAddresses,
  fetchBundleHexData,
  fetchBundlePancakeData,
  fetchBundlePhiatData,
  fetchBundlePulsexData,
  fetchBundleSushiData,
  fetchBundleWalletData,
  setBundleFetched
} from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleAddress,
  selectBundleAddresses,
  selectBundleHasFetched
} from '@app-src/store/bundles/selectors';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BundlePortfolioPage = () => {
  const dispatch = useAppDispatch();

  const bundleAddress = useSelector(useCallback(selectBundleAddress, []));
  const bundleAddresses = useSelector(useCallback(selectBundleAddresses, []));
  const hasFetched = useSelector(useCallback(selectBundleHasFetched, []));

  useEffect(() => {
    if (!hasFetched && bundleAddress) {
      const bundleAddressPromise = dispatch(fetchBundleAddresses());

      return () => {
        bundleAddressPromise.abort();
      };
    }
  }, [hasFetched, bundleAddress]);

  useEffect(() => {
    if (hasFetched || !bundleAddresses || bundleAddresses.length === 0) return;

    Promise.all([
      dispatch(fetchBundleWalletData(bundleAddresses)),
      dispatch(fetchBundleHexData(bundleAddresses)),
      dispatch(fetchBundlePhiatData(bundleAddresses)),
      dispatch(fetchBundlePulsexData(bundleAddresses)),
      dispatch(fetchBundlePancakeData(bundleAddresses)),
      dispatch(fetchBundleSushiData(bundleAddresses))
    ]).then(() => dispatch(setBundleFetched(true)));
  }, [bundleAddresses, hasFetched]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard page="bundle" />
        <WalletTableGroup page="bundle" />
        <HexTableGroup page="bundle" />
        <PhiatTableGroup page="bundle" />
        <PulsexTableGroup page="bundle" />
        <PancakeTableGroup page="bundle" />
        <SushiTableGroup page="bundle" />
      </div>
    </div>
  );
};

export default BundlePortfolioPage;
