import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
import {
  isArrayOfPortfolioChain,
  PortfolioChain,
  PortfolioEnum
} from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import PublicHeader from '@app-src/modules/public/components/PublicHeader';
import {
  clearPortfolio,
  fetchPortfolioData,
  fetchPublicBundleData,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import {
  selectAddresses,
  selectChainsTotal,
  selectDisplayAddress,
  selectHasFetched
} from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const BundlePublicPortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  const id = useMemo(() => Number(router.query.id), [router]);

  const displayAddress = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.PUBLIC), [])
  );
  const addresses = useAppSelector(useCallback(selectAddresses(PortfolioEnum.PUBLIC), []));
  const hasFetched = useAppSelector(useCallback(selectHasFetched(PortfolioEnum.PUBLIC), []));
  const total = useAppSelector(
    useCallback(selectChainsTotal(currentChains, PortfolioEnum.PUBLIC), [currentChains])
  );

  const styledTotal = useMemo(() => formatToMoney(total), [total]);

  useEffect(() => {
    if (hasFetched || isNaN(id)) return;

    dispatch(fetchPublicBundleData(id));
  }, [dispatch, hasFetched, id]);

  useEffect(() => {
    if (hasFetched || !addresses || addresses.length === 0) return;

    const controller = new AbortController();

    fetchPortfolioData(dispatch, addresses, PortfolioEnum.PUBLIC, controller.signal).then(() => {
      const aborted = controller.signal.aborted;

      if (aborted) dispatch(clearPortfolio(PortfolioEnum.PUBLIC));
      else dispatch(setHasFetched({ hasFetched: true, type: PortfolioEnum.PUBLIC }));
    });

    return () => controller.abort();
  }, [dispatch, addresses, hasFetched]);

  useEffect(() => {
    const chains = router.query.chains;
    if (!chains || typeof chains === 'object') return;

    const chainsArr = chains.split(',');

    if (!isArrayOfPortfolioChain(chainsArr)) return;
    setCurrentChains(chainsArr);
  }, [router.query.chains]);

  const handleRefreshData = useCallback(() => {
    if (!addresses || addresses.length === 0) return;

    const controller = new AbortController();

    fetchPortfolioData(dispatch, addresses, PortfolioEnum.PUBLIC, controller.signal, true);

    return () => controller.abort();
  }, [dispatch, addresses]);

  return (
    <div className="flex flex-col gap-y-24">
      <PublicHeader
        displayName={displayAddress}
        currentChains={currentChains}
        onRefreshData={handleRefreshData}
        total={styledTotal}
      />
      <PortfolioPage page={PortfolioEnum.PUBLIC} chains={currentChains} />
    </div>
  );
};

export default BundlePublicPortfolioPage;
