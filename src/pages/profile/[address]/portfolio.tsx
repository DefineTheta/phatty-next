import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PortfolioPage from '@app-src/modules/portfolio/components/PortfolioPage';
import {
  isArrayOfPortfolioChain,
  PortfolioChain,
  PortfolioEnum
} from '@app-src/modules/portfolio/types/portfolio';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { fetchPortfolioData, setHasFetched } from '@app-src/store/portfolio/portfolioSlice';
import { selectHasFetched } from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const ProfilePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const address = String(router.query.address || '');
  const hasFetched = useAppSelector(useCallback(selectHasFetched(PortfolioEnum.PROFILE), []));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  useEffect(() => {
    if (hasFetched || !address) return;
    console.log('Address', address);

    fetchPortfolioData(dispatch, [address], PortfolioEnum.PROFILE).then(() =>
      dispatch(setHasFetched({ hasFetched: true, type: PortfolioEnum.PROFILE }))
    );
  }, [hasFetched, address]);

  useEffect(() => {
    const chains = router.query.chains;
    if (!chains || typeof chains === 'object') return;

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
