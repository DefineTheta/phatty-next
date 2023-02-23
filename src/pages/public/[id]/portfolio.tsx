import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
import {
  isArrayOfPortfolioChain,
  PortfolioChain
} from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import PublicHeader from '@app-src/modules/public/components/PublicHeader';
import { fetchPublicBundle } from '@app-src/store/bundle/bundleSlice';
import {
  selectCurrentPublicBundleAddresses,
  selectCurrentPublicBundleName
} from '@app-src/store/bundle/selectors';
import {
  clearPortfolio,
  fetchPortfolioData,
  setDisplayAddress
} from '@app-src/store/portfolio/portfolioSlice';
import { selectChainsTotal, selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { PortfolioEnum } from '@app-src/store/portfolio/types';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PublicBundlePortfolioPage = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { id: bundleId } = router.query;

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  const fetchedBundleId = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.PUBLIC), [])
  );
  const bundleAddresses = useAppSelector(useCallback(selectCurrentPublicBundleAddresses, []));
  const bundleName = useAppSelector(useCallback(selectCurrentPublicBundleName, []));

  const total = useAppSelector(
    useCallback(selectChainsTotal(currentChains, PortfolioEnum.PUBLIC), [currentChains])
  );
  const styledTotal = useMemo(() => formatToMoney(total), [total]);

  useEffect(() => {
    if (typeof bundleId === 'string' && bundleId !== fetchedBundleId) {
      const promise = dispatch(fetchPublicBundle(bundleId));
      promise.then(() => dispatch(clearPortfolio(PortfolioEnum.PUBLIC)));

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
      fetchPortfolioData(dispatch, bundleAddresses, PortfolioEnum.PUBLIC, controller.signal).then(
        () => {
          const aborted = controller.signal.aborted;

          if (aborted) dispatch(clearPortfolio(PortfolioEnum.PUBLIC));
          else dispatch(setDisplayAddress({ address: bundleId, type: PortfolioEnum.PUBLIC }));
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
      <PublicHeader
        displayName={bundleName}
        currentChains={currentChains}
        onRefreshData={() => console.log('sdf')}
        total={styledTotal}
      />
      <PortfolioPage page={PortfolioEnum.PUBLIC} chains={currentChains} />
    </div>
  );
};

export default PublicBundlePortfolioPage;
