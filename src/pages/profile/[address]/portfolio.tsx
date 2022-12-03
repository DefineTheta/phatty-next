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
  PortfolioChain
} from '@app-src/modules/portfolio/types/portfolio';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { fetchPortfolioData, setProfileHasFetched } from '@app-src/store/protocol/protocolSlice';
import { selectProfileHasFetched } from '@app-src/store/protocol/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const ProfilePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const address = String(router.query.address || '');
  const hasFetched = useAppSelector(useCallback(selectProfileHasFetched, []));

  const [currentChains, setCurrentChains] = useState<PortfolioChain[]>([]);

  useEffect(() => {
    if (hasFetched || !address) return;
    console.log('Address', address);

    fetchPortfolioData(dispatch, address).then(() => dispatch(setProfileHasFetched(true)));
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
            <ChainSummaryCard page="profile" currentChains={currentChains} />
            <WalletTableGroup page="profile" currentChains={currentChains} />
            <HexTableGroup page="profile" currentChains={currentChains} />
            <PhiatTableGroup page="profile" currentChains={currentChains} />
            <PhamousTableGroup page="profile" currentChains={currentChains} />
            <PulsexTableGroup page="profile" currentChains={currentChains} />
            <PancakeTableGroup page="profile" currentChains={currentChains} />
            <SushiTableGroup page="profile" currentChains={currentChains} />
            <UniV2TableGroup page="profile" currentChains={currentChains} />
            <UniV3TableGroup page="profile" currentChains={currentChains} />
            <HedronTableGroup page="profile" currentChains={currentChains} />
            <XenTableGroup page="profile" currentChains={currentChains} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePortfolioPage;
