import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HedronTableGroup from '@app-src/modules/portfolio/components/hedron/HedronTableGroup';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhamousTableGroup from '@app-src/modules/portfolio/components/phamous/PhamousTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import UniV2TableGroup from '@app-src/modules/portfolio/components/univ2/UniV2TableGroup';
import UniV3TableGroup from '@app-src/modules/portfolio/components/univ3/UniV3TableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import XenTableGroup from '@app-src/modules/portfolio/components/xen/XenTableGroup';
import {
  isArrayOfPortfolioChain,
  PortfolioChain
} from '@app-src/modules/portfolio/types/portfolio';
import {
  fetchBundleAddresses,
  fetchBundlePortfolioData,
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

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

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

    fetchBundlePortfolioData(dispatch, bundleAddresses).then(() =>
      dispatch(setBundleFetched(true))
    );
  }, [bundleAddresses, hasFetched]);

  useEffect(() => {
    const chains = router.query.chains;
    if (!chains || typeof chains === 'object') return;

    const chainsArr = chains.split(',');

    if (!isArrayOfPortfolioChain(chainsArr)) return;
    setCurrentChains(chainsArr);
  }, [router.query.chains]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} currentChains={currentChains} />
      <div className="flex w-full justify-center">
        <Container>
          <div className="flex w-full flex-col items-center gap-y-30">
            <ChainSummaryCard page="bundle" currentChains={currentChains} />
            <WalletTableGroup page="bundle" currentChains={currentChains} />
            <HexTableGroup page="bundle" currentChains={currentChains} />
            <PhiatTableGroup page="bundle" currentChains={currentChains} />
            <PhamousTableGroup page="bundle" currentChains={currentChains} />
            <PulsexTableGroup page="bundle" currentChains={currentChains} />
            <PancakeTableGroup page="bundle" currentChains={currentChains} />
            <SushiTableGroup page="bundle" currentChains={currentChains} />
            <UniV2TableGroup page="bundle" currentChains={currentChains} />
            <UniV3TableGroup page="bundle" currentChains={currentChains} />
            <HedronTableGroup page="bundle" currentChains={currentChains} />
            <XenTableGroup page="bundle" currentChains={currentChains} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BundlePortfolioPage;
