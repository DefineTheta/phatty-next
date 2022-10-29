import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import {
  fetchBundleAddresses,
  fetchBundleHexData,
  fetchBundlePancakeData,
  fetchBundlePhiatData,
  fetchBundlePulsexData,
  fetchBundleWalletData
} from '@app-src/store/bundles/bundleSlice';
import { selectBundleAddresses } from '@app-src/store/bundles/selectors';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BundlePage = () => {
  const dispatch = useAppDispatch();

  const bundleAddresses = useSelector(useCallback(selectBundleAddresses, []));

  useEffect(() => {
    const bundleAddressPromise = dispatch(fetchBundleAddresses());

    return () => {
      bundleAddressPromise.abort();
    };
  }, []);

  useEffect(() => {
    if (!bundleAddresses || bundleAddresses.length === 0) return;

    dispatch(fetchBundleWalletData(bundleAddresses));
    dispatch(fetchBundleHexData(bundleAddresses));
    dispatch(fetchBundlePhiatData(bundleAddresses));
    dispatch(fetchBundlePulsexData(bundleAddresses));
    dispatch(fetchBundlePancakeData(bundleAddresses));
  }, [bundleAddresses]);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard />
        <WalletTableGroup page="bundle" />
        <HexTableGroup page="bundle" />
        <PhiatTableGroup page="bundle" />
        <PulsexTableGroup page="bundle" />
        <PancakeTableGroup page="bundle" />
      </div>
    </div>
  );
};

export default BundlePage;
