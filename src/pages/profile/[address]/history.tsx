import Container from '@app-src/common/components/layout/Container';
import HistoryTable from '@app-src/modules/profile/components/History/HistoryTable';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { useRouter } from 'next/router';

const ProfileHistoryPage = () => {
  const router = useRouter();

  const address = String(router.query.address || '');

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} chain="" />
      <div className="flex w-full justify-center">
        <Container>
          <div className="flex w-full flex-col items-center gap-y-30">
            <HistoryTable />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProfileHistoryPage;
