import SearchInput from '@app-src/common/components/input/SearchInput';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { setCheckerHasFetched } from '@app-src/store/checker/checkerSlice';
import { setHistoryHasFetched } from '@app-src/store/history/historySlice';
import {
  deleteBundleSession,
  fetchBundleAddresses,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import Container from './Container';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const bundleAddress = useSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const address = searchInputRef.current?.value.toLowerCase().trim() || '';
        if (!address) return;

        router.push(`/profile/${address}/portfolio`).then(() => {
          dispatch(setHasFetched({ hasFetched: false, type: PortfolioEnum.PROFILE }));
          dispatch(setCheckerHasFetched({ fetched: false, type: 'PROFILE' }));
          dispatch(setHistoryHasFetched(false));
        });
      }
    },
    [dispatch, router, searchInputRef]
  );

  const handleButtonClick = (type: 'connect' | 'disconnect') => {
    console.log(type);
    if (type === 'disconnect') {
      dispatch(deleteBundleSession()).then(() => {
        dispatch(setCheckerHasFetched({ type: 'BUNDLE', fetched: false }));
        router.push(`/bundle`);
      });
    } else if (type === 'connect') {
      dispatch(fetchBundleAddresses());
    }
  };

  return (
    <div className="sticky top-0 z-20 flex w-full flex-row justify-center border-b border-border-100 bg-background-200 py-10 md:relative">
      <Container>
        <div className="ml-36 flex h-full flex-row items-center justify-end gap-x-24 md:ml-0">
          <SearchInput onKeyDown={handleSearch} inputRef={searchInputRef} />
          <button
            className="hidden cursor-pointer rounded-full bg-purple-button py-6 px-24 shadow-md md:flex"
            onClick={() => handleButtonClick(bundleAddress ? 'disconnect' : 'connect')}
          >
            <span className="text-base font-semibold text-text-300">
              {bundleAddress ? 'Disconnect' : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
