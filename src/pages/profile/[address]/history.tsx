import Container from '@app-src/common/components/layout/Container';
import HistoryTable from '@app-src/modules/profile/components/History/HistoryTable';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import Modal from 'react-modal';

const ProfileHistoryPage = () => {
  const router = useRouter();

  const address = String(router.query.address || '');

  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleModalClose = useCallback(() => setIsModalVisible(false), []);

  return (
    <>
      <Modal
        shouldCloseOnOverlayClick
        isOpen={isModalVisible}
        onRequestClose={handleModalClose}
        overlayClassName="absolute top-0 left-0 z-50 h-screen w-screen flex flex-row items-center justify-center bg-black/40"
        className="mx-20 flex w-600 flex-col gap-y-20 bg-background-100 p-16 pb-30 text-text-200 shadow-xl focus:outline-none md:m-0"
      >
        <div className="flex flex-row justify-between text-center">
          <span className="text-xl font-extrabold tracking-wider"></span>
          <button className="cursor-pointer" onClick={handleModalClose}>
            <XMarkIcon className="h-24 w-24 text-text-300" />
          </button>
        </div>
        <p className="text-base">
          The history data is using third party services such as etherscan.io and might be slow to
          load. It only supports a few chains and only goes back by a limited number of blocks. It
          is for testing and as a proof concept only.
        </p>
      </Modal>
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
    </>
  );
};

export default ProfileHistoryPage;
