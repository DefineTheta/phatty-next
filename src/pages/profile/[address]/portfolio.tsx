import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
import {
  isArrayOfPortfolioChain,
  PortfolioChain,
  PortfolioEnum
} from '@app-src/modules/portfolio/types/portfolio';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import {
  clearPortfolio,
  fetchPortfolioData,
  setDisplayAddress,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import { selectHasFetched } from '@app-src/store/portfolio/selectors';
import { useWhatChanged } from '@simbathesailor/use-what-changed';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ProfilePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const address = useMemo(() => {
    console.log('ROUTER');
    return String(router.query.address || '');
  }, [router]);
  const hasFetched = useAppSelector(useCallback(selectHasFetched(PortfolioEnum.PROFILE), []));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  useWhatChanged([dispatch, hasFetched, address], 'dispatch, hasFetched, address');

  useEffect(() => {
    if (hasFetched || !address) return;

    const controller = new AbortController();

    fetchPortfolioData(dispatch, [address], PortfolioEnum.PROFILE, controller.signal).then(() => {
      const aborted = controller.signal.aborted;

      if (aborted) dispatch(clearPortfolio(PortfolioEnum.PROFILE));
      else {
        dispatch(setHasFetched({ hasFetched: true, type: PortfolioEnum.PROFILE }));
        dispatch(setDisplayAddress({ address, type: PortfolioEnum.PROFILE }));
      }
    });

    return () => controller.abort();
  }, [dispatch, hasFetched, address]);

  useEffect(() => {
    const chains = router.query.chains;

    if (typeof chains === 'object') return;
    else if (!chains) {
      setCurrentChains([]);
      return;
    }

    const chainsArr = chains.split(',');

    if (!isArrayOfPortfolioChain(chainsArr)) return;
    setCurrentChains(chainsArr);
  }, [router.query.chains]);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} currentChains={currentChains} />
      <PortfolioPage page={PortfolioEnum.PROFILE} chains={currentChains} />
    </div>
  );
};

export default ProfilePortfolioPage;
