import SearchInput from '@app-src/common/components/input/SearchInput';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { setProfileAddress, setProfileHasFetched } from '@app-src/store/protocol/protocolSlice';
import { useRouter } from 'next/router';
import { KeyboardEvent, useCallback, useRef } from 'react';

const NavBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const address = searchInputRef.current?.value.toLowerCase().trim() || '';
        if (!address) return;

        router.push(`/profile/${address}/portfolio`).then(() => {
          dispatch(setProfileHasFetched(false));
          dispatch(setProfileAddress(address));
        });
      }
    },
    [searchInputRef]
  );

  return (
    <div className="w-full py-10 flex flex-row justify-center bg-background-200 border-b border-border-100">
      <div className="w-full max-w-96">
        <div className="h-full flex flex-row justify-end items-center gap-x-24">
          <SearchInput onKeyDown={handleSearch} inputRef={searchInputRef} />
          <button className="py-6 px-24 bg-purple-button rounded-full shadow-md cursor-pointer">
            <span className="text-base font-semibold text-text-300">Connect Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
