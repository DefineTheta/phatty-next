import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HedronTableGroup from '@app-src/modules/portfolio/components/hedron/HedronTableGroup';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import UniV2TableGroup from '@app-src/modules/portfolio/components/univ2/UniV2TableGroup';
import UniV3TableGroup from '@app-src/modules/portfolio/components/univ3/UniV3TableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
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

  const [currentChain, setCurrentChain] = useState<PortfolioChain>('');

  useEffect(() => {
    if (hasFetched || !address) return;
    console.log('Address', address);

    fetchPortfolioData(dispatch, address).then(() => dispatch(setProfileHasFetched(true)));
  }, [hasFetched, address]);

  useEffect(() => {
    const chain = String(router.query.chain || '');

    if (['ETH', 'BSC', 'TPLS'].includes(chain)) setCurrentChain(chain as PortfolioChain);
    else setCurrentChain('');
  }, [router.query.chain]);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} chain={currentChain} />
      <div className="flex w-full flex-col items-center gap-y-30">
        <ChainSummaryCard page="profile" chain={currentChain} />
        <WalletTableGroup page="profile" chain={currentChain} />
        <HexTableGroup page="profile" chain={currentChain} />
        <PhiatTableGroup page="profile" chain={currentChain} />
        <PulsexTableGroup page="profile" chain={currentChain} />
        <PancakeTableGroup page="profile" chain={currentChain} />
        <SushiTableGroup page="profile" chain={currentChain} />
        <UniV2TableGroup page="profile" chain={currentChain} />
        <UniV3TableGroup page="profile" chain={currentChain} />
        <HedronTableGroup page="profile" chain={currentChain} />
      </div>
    </div>
  );
};

export default ProfilePortfolioPage;
