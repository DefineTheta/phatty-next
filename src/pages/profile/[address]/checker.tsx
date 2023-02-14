import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import PhameTableGroup from '@app-src/modules/bundle/components/Checker/Phame/PhameTableGroup';
import PhiatTableGroup from '@app-src/modules/bundle/components/Checker/Phiat/PhiatTableGroup';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import { fetchCheckerData, setCheckerHasFetched } from '@app-src/store/checker/checkerSlice';
import { selectCheckerHasFetched } from '@app-src/store/checker/selectors';
import { SectionEnum } from '@app-src/store/checker/types';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';

const CheckerPage = () => {
  const dispatch = useAppDispatch();

  const profileAddress = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.PROFILE), [])
  );
  const hasFetched = useAppSelector(useCallback(selectCheckerHasFetched('PROFILE'), []));

  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleModalClose = useCallback(() => setIsModalVisible(false), []);

  useEffect(() => {
    console.log('HAS FETCHED:', hasFetched);
    if (!hasFetched && profileAddress) {
      dispatch(fetchCheckerData({ address: profileAddress, type: 'PROFILE' })).then(() => {
        dispatch(setCheckerHasFetched({ type: 'PROFILE', fetched: true }));
      });
    }
  }, [dispatch, hasFetched, profileAddress]);

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
        <p className="text-base">Data is as at 13-Feb-2023 UCT.</p>
        <p className="text-base">
          Only transactions before/on this date are included. We will re-pull numbers again towards
          the end of sac. Some token prices might change if Nomics updates their data.
        </p>
        <p className="text-base">
          Please note the calculations are not finalized. It is only a draft version and might
          contain errors. If you notice any error, please let us know in Telegram.
        </p>
      </Modal>
      <div className="flex flex-col gap-y-24">
        <ProfileHeader address={profileAddress} currentChains={[]} />
        <div className="flex w-full justify-center">
          <Container>
            <div className="flex w-full flex-col items-center gap-y-30">
              <PhiatTableGroup section={SectionEnum.PROFILE} />
              <PhameTableGroup section={SectionEnum.PROFILE} />
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default CheckerPage;
