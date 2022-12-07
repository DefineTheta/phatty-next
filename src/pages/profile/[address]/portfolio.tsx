import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
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
      <div className="flex w-full justify-center">
        <Container>
          <div className="flex flex-col items-center gap-y-30">
            <ChainSummaryCard page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <WalletTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <HexTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <PhiatTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <PhamousTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <PulsexTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <PancakeTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <SushiTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <UniV2TableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <UniV3TableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <HedronTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
            <XenTableGroup page={PortfolioEnum.PROFILE} currentChains={currentChains} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePortfolioPage;
