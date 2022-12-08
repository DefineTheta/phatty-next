import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
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
      <PortfolioPage page={PortfolioEnum.BUNDLE} chains={currentChains} />
    </div>
  );
};

export default BundlePortfolioPage;
