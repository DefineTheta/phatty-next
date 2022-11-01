import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import {
  fetchHexData,
  fetchPancakeData,
  fetchPhiatData,
  fetchPulsexData,
  fetchSushiData,
  fetchWalletData,
  setProfileHasFetched
} from '@app-src/store/protocol/protocolSlice';
import { selectProfileHasFetched } from '@app-src/store/protocol/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProfilePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const address = String(router.query.address || '');
  const hasFetched = useSelector(useCallback(selectProfileHasFetched, []));

  useEffect(() => {
    if (hasFetched || !address) return;
    console.log('Address', address);

    Promise.all([
      dispatch(fetchWalletData(address)),
      dispatch(fetchHexData(address)),
      dispatch(fetchPhiatData(address)),
      dispatch(fetchPulsexData(address)),
      dispatch(fetchPancakeData(address)),
      dispatch(fetchSushiData(address))
    ]).then(() => dispatch(setProfileHasFetched(true)));
  }, [hasFetched, address]);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard page="profile" />
        <WalletTableGroup page="profile" />
        <HexTableGroup page="profile" />
        <PhiatTableGroup page="profile" />
        <PulsexTableGroup page="profile" />
        <PancakeTableGroup page="profile" />
        <SushiTableGroup page="profile" />
      </div>
    </div>
  );
};

export default ProfilePortfolioPage;
