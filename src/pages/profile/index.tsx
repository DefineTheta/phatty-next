import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { selectProfileAddress } from '@app-src/store/protocol/selectors';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const profileAddress = useSelector(useCallback(selectProfileAddress, []));

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={profileAddress} chain="" />
      <Container>
        <div className="flex w-full flex-col items-center gap-y-30">
          <Card>
            <div className="flex flex-row justify-center">
              <span className="text-xl font-bold text-text-200">Search for an address</span>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
