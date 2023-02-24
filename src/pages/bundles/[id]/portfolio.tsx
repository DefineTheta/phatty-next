import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
import {
  isArrayOfPortfolioChain,
  PortfolioChain
} from '@app-src/modules/portfolio/types/portfolio';
import { fetchBundle } from '@app-src/store/bundle/bundleSlice';
import { selectCurrentBundleAddresses } from '@app-src/store/bundle/selectors';
import {
  clearBundlePortfolio,
  fetchPortfolioData,
  setDisplayAddress
} from '@app-src/store/portfolio/portfolioSlice';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { PortfolioEnum } from '@app-src/store/portfolio/types';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const BundlePortfolioPage = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id: bundleId } = router.query;

  const fetchedBundleId = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), [])
  );
  const bundleAddresses = useAppSelector(useCallback(selectCurrentBundleAddresses, []));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  useEffect(() => {
    if (typeof bundleId === 'string' && bundleId !== fetchedBundleId) {
      const promise = dispatch(fetchBundle(bundleId));
      promise.then(() => dispatch(clearBundlePortfolio()));

      return () => promise.abort();
    }
  }, [dispatch, bundleId, fetchedBundleId]);

  useEffect(() => {
    const controller = new AbortController();

    if (
      typeof bundleId === 'string' &&
      bundleId !== fetchedBundleId &&
      bundleAddresses.length !== 0
    ) {
      fetchPortfolioData(dispatch, bundleAddresses, PortfolioEnum.BUNDLE, controller.signal).then(
        () => {
          const aborted = controller.signal.aborted;

          if (aborted) dispatch(clearBundlePortfolio());
          else dispatch(setDisplayAddress({ address: bundleId, type: PortfolioEnum.BUNDLE }));
        }
      );
    }

    return () => controller.abort();
  }, [dispatch, bundleId, fetchedBundleId, bundleAddresses]);

  useEffect(() => {
    const chains = router.query.chains;
    if (!chains || typeof chains === 'object') return;

    const chainsArr = chains.split(',');

    if (!isArrayOfPortfolioChain(chainsArr)) return;
    setCurrentChains(chainsArr);
  }, [router.query.chains]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader currentChains={currentChains} />
      <PortfolioPage page={PortfolioEnum.BUNDLE} chains={currentChains} />
    </div>
  );
};

export default BundlePortfolioPage;
