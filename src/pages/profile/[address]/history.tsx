import HistoryTable from '@app-src/modules/profile/components/History/HistoryTable';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { useRouter } from 'next/router';

const ProfileHistoryPage = () => {
  const router = useRouter();

  const address = String(router.query.address || '');

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} chain="" />
      <div className="w-full flex flex-col items-center gap-y-30">
        <HistoryTable />
      </div>
    </div>
  );
};

export default ProfileHistoryPage;
