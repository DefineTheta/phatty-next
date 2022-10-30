import Card from '@app-src/common/components/layout/Card';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader />
      <div className="w-full flex flex-col items-center gap-y-30">
        <Card>
          <div className="flex flex-row justify-center">
            <span className="text-xl font-bold text-text-200">Search for an address</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
