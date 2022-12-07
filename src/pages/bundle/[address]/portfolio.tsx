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
  PortfolioChain,
  PortfolioEnum
} from '@app-src/modules/portfolio/types/portfolio';
import {
  fetchBundleAddresses,
  fetchPortfolioData,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import {
  selectAddresses,
  selectDisplayAddress,
  selectHasFetched
} from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const BundlePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const bundleAddress = useAppSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));
  const bundleAddresses = useAppSelector(useCallback(selectAddresses(PortfolioEnum.BUNDLE), []));
  const hasFetched = useAppSelector(useCallback(selectHasFetched(PortfolioEnum.BUNDLE), []));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  useEffect(() => {
    if (!hasFetched && bundleAddress) {
      const bundleAddressPromise = dispatch(fetchBundleAddresses());

      return () => {
        bundleAddressPromise.abort();
      };
    }
  }, [dispatch, hasFetched, bundleAddress]);

  useEffect(() => {
    if (hasFetched || !bundleAddresses || bundleAddresses.length === 0) return;

    fetchPortfolioData(dispatch, bundleAddresses, PortfolioEnum.BUNDLE).then(() =>
      dispatch(setHasFetched({ hasFetched: true, type: PortfolioEnum.BUNDLE }))
    );
  }, [dispatch, bundleAddresses, hasFetched]);

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
            <ChainSummaryCard page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <WalletTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <HexTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <PhiatTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <PhamousTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <PulsexTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <PancakeTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <SushiTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <UniV2TableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <UniV3TableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <HedronTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
            <XenTableGroup page={PortfolioEnum.BUNDLE} currentChains={currentChains} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BundlePortfolioPage;
