import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const profileAddress = useSelector(useCallback(selectDisplayAddress(PortfolioEnum.PROFILE), []));

  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleModalClose = useCallback(() => setIsModalVisible(false), []);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={profileAddress} currentChains={[]} />
      <div className="flex w-full flex-col items-center gap-y-30">
        <Container>
          <Card>
            <div className="flex flex-row justify-center">
              <span className="text-xl font-bold text-text-200">Search for an address</span>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;
