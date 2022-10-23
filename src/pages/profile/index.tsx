import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';

const ProfilePage = () => {
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
