import SearchInput from '@app-src/common/components/input/SearchInput';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { deleteBundleSession, fetchBundleAddresses } from '@app-src/store/bundles/bundleSlice';
import { selectBundleAddress } from '@app-src/store/bundles/selectors';
import { setHistoryHasFetched } from '@app-src/store/history/historySlice';
import { setProfileAddress, setProfileHasFetched } from '@app-src/store/protocol/protocolSlice';
import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const bundleAddress = useSelector(useCallback(selectBundleAddress, []));

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const address = searchInputRef.current?.value.toLowerCase().trim() || '';
        if (!address) return;

        router.push(`/profile/${address}/portfolio`).then(() => {
          dispatch(setProfileHasFetched(false));
          dispatch(setHistoryHasFetched(false));
          dispatch(setProfileAddress(address));
        });
      }
    },
    [searchInputRef]
  );

  const handleButtonClick = (type: 'connect' | 'disconnect') => {
    console.log(type);
    if (type === 'disconnect') {
      dispatch(deleteBundleSession());
    } else if (type === 'connect') {
      dispatch(fetchBundleAddresses());
    }
  };

  return (
    <div className="w-full py-10 flex flex-row justify-center bg-background-200 border-b border-border-100">
      <div className="w-full max-w-96">
        <div className="h-full flex flex-row justify-end items-center gap-x-24">
          <SearchInput onKeyDown={handleSearch} inputRef={searchInputRef} />
          <button
            className="py-6 px-24 bg-purple-button rounded-full shadow-md cursor-pointer"
            onClick={() => handleButtonClick(bundleAddress ? 'disconnect' : 'connect')}
          >
            <span className="text-base font-semibold text-text-300">
              {bundleAddress ? 'Disconnect' : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
