import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import UniV2TableGroup from '@app-src/modules/portfolio/components/univ2/UniV2TableGroup';
import UniV3TableGroup from '@app-src/modules/portfolio/components/univ3/UniV3TableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import {
  fetchBundleAddresses,
  fetchBundleHexData,
  fetchBundlePancakeData,
  fetchBundlePhiatData,
  fetchBundlePulsexData,
  fetchBundleSushiData,
  fetchBundleUniV2Data,
  fetchBundleUniV3Data,
  fetchBundleWalletData,
  setBundleFetched
} from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleAddress,
  selectBundleAddresses,
  selectBundleHasFetched
} from '@app-src/store/bundles/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const BundlePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const bundleAddress = useAppSelector(useCallback(selectBundleAddress, []));
  const bundleAddresses = useAppSelector(useCallback(selectBundleAddresses, []));
  const hasFetched = useAppSelector(useCallback(selectBundleHasFetched, []));

  const [currentChain, setCurrentChain] = useState<PortfolioChain>('');

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
      dispatch(fetchBundleSushiData(bundleAddresses)),
      dispatch(fetchBundleUniV2Data(bundleAddresses)),
      dispatch(fetchBundleUniV3Data(bundleAddresses))
    ]).then(() => dispatch(setBundleFetched(true)));
  }, [bundleAddresses, hasFetched]);

  useEffect(() => {
    const chain = String(router.query.chain || '');

    if (['ETH', 'BSC', 'TPLS'].includes(chain)) setCurrentChain(chain as PortfolioChain);
    else setCurrentChain('');
  }, [router.query.chain]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard page="bundle" chain={currentChain} />
        <WalletTableGroup page="bundle" chain={currentChain} />
        <HexTableGroup page="bundle" chain={currentChain} />
        <PhiatTableGroup page="bundle" chain={currentChain} />
        <PulsexTableGroup page="bundle" chain={currentChain} />
        <PancakeTableGroup page="bundle" chain={currentChain} />
        <SushiTableGroup page="bundle" chain={currentChain} />
        <UniV2TableGroup page="bundle" chain={currentChain} />
        <UniV3TableGroup page="bundle" chain={currentChain} />
      </div>
    </div>
  );
};

export default BundlePortfolioPage;
