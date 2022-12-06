import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PublicBundleHeader from '@app-src/modules/bundle/components/PublicBundleHeader';
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
  PublicBundleAddresses,
  PublicBundleLookup,
  PublicBundleName
} from '@app-src/modules/portfolio/types/portfolio';
import {
  fetchPortfolioData,
  setAddresses,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import { selectHasFetched } from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const BundlePublicPortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const index = useMemo(() => Number(router.asPath.split('/').at(-1)?.split('?')[0]), [router]);
  const portfolioType = useMemo(
    () => (!isNaN(index) ? PublicBundleLookup[index] : undefined),
    [index]
  );
  const addresses = useMemo(() => (!isNaN(index) ? PublicBundleAddresses[index] : []), [index]);

  // const addresses = useAppSelector(useCallback(selectAddresses(portfolioType)), [portfolioType]);
  const hasFetched = useAppSelector(useCallback(selectHasFetched(portfolioType), [portfolioType]));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  // useEffect(() => {
  //   if (!hasFetched && bundleAddress) {
  //     const bundleAddressPromise = dispatch(fetchBundleAddresses());

  //     return () => {
  //       bundleAddressPromise.abort();
  //     };
  //   }
  // }, [dispatch, hasFetched, bundleAddress]);

  useEffect(() => {
    if (!portfolioType || !addresses || addresses.length === 0) return;

    dispatch(setAddresses({ addresses, type: portfolioType }));
  }, [dispatch, addresses, portfolioType]);

  useEffect(() => {
    if (hasFetched || !portfolioType || !addresses || addresses.length === 0) return;

    fetchPortfolioData(dispatch, addresses, portfolioType).then(() =>
      dispatch(setHasFetched({ hasFetched: true, type: portfolioType }))
    );
  }, [dispatch, addresses, hasFetched, portfolioType]);

  useEffect(() => {
    const chains = router.query.chains;
    if (!chains || typeof chains === 'object') return;

    const chainsArr = chains.split(',');

    if (!isArrayOfPortfolioChain(chainsArr)) return;
    setCurrentChains(chainsArr);
  }, [router.query.chains]);

  if (portfolioType) {
    return (
      <div className="flex flex-col gap-y-24">
        <PublicBundleHeader
          page={portfolioType}
          currentChains={currentChains}
          displayName={PublicBundleName[index]}
        />
        <div className="flex w-full justify-center">
          <Container>
            <div className="flex w-full flex-col items-center gap-y-30">
              <ChainSummaryCard page={portfolioType} currentChains={currentChains} />
              <WalletTableGroup page={portfolioType} currentChains={currentChains} />
              <HexTableGroup page={portfolioType} currentChains={currentChains} />
              <PhiatTableGroup page={portfolioType} currentChains={currentChains} />
              <PhamousTableGroup page={portfolioType} currentChains={currentChains} />
              <PulsexTableGroup page={portfolioType} currentChains={currentChains} />
              <PancakeTableGroup page={portfolioType} currentChains={currentChains} />
              <SushiTableGroup page={portfolioType} currentChains={currentChains} />
              <UniV2TableGroup page={portfolioType} currentChains={currentChains} />
              <UniV3TableGroup page={portfolioType} currentChains={currentChains} />
              <HedronTableGroup page={portfolioType} currentChains={currentChains} />
              <XenTableGroup page={portfolioType} currentChains={currentChains} />
            </div>
          </Container>
        </div>
      </div>
    );
  }
};

export default BundlePublicPortfolioPage;
