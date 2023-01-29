import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import PhameTableGroup from '@app-src/modules/bundle/components/Checker/Phame/PhameTableGroup';
import PhiatTableGroup from '@app-src/modules/bundle/components/Checker/Phiat/PhiatTableGroup';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { fetchCheckerData, setCheckerHasFetched } from '@app-src/store/checker/checkerSlice';
import { selectCheckerHasFetched } from '@app-src/store/checker/selectors';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useCallback, useEffect } from 'react';

const CheckerPage = () => {
  const dispatch = useAppDispatch();

  const bundleAddress = useAppSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));
  const hasFetched = useAppSelector(useCallback(selectCheckerHasFetched, []));

  useEffect(() => {
    if (!hasFetched && bundleAddress) {
      dispatch(fetchCheckerData(bundleAddress)).then(() => {
        dispatch(setCheckerHasFetched(true));
      });
    }
  }, [dispatch, hasFetched, bundleAddress]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} currentChains={[]} />
      <div className="flex w-full justify-center">
        <Container>
          <div className="flex w-full flex-col items-center gap-y-30">
            <PhiatTableGroup />
            <PhameTableGroup />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CheckerPage;
