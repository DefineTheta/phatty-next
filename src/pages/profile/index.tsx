import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';

import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { fetchHexData, fetchWalletData } from '@app-src/store/protocol/protocolSlice';
import { useEffect } from 'react';

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchWalletData('0xab502a6fb9b9984341e77716b36484ac13dddc62'));
    dispatch(fetchHexData('0xab502a6fb9b9984341e77716b36484ac13dddc62'));
  }, []);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard />
        <WalletTableGroup />
        <HexTableGroup />
      </div>
    </div>
  );
};

export default ProfilePage;
