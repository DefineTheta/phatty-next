import SearchInput from "@app-src/common/components/input/SearchInput";
import { KeyboardEvent, useCallback, useRef } from "react";

const NavBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // if (e.key === 'Enter') {
    //   dispatch(clearState);
    //   navigate(`/profile/${searchInputRef.current?.value.toLowerCase().trim()}`);
    // }
  }, []);

  return (
    <div className='w-full h-60 flex flex-row justify-center bg-background-200 border-b border-border-100'>
      <div className="w-full max-w-96">
        <div className="h-full flex flex-row justify-end items-center gap-x-24">
          <SearchInput onKeyDown={handleSearch} inputRef={searchInputRef} />
          <button className="py-6 px-14 bg-purple-button rounded-full shadow-md cursor-pointer">
            <span className="text-base font-semibold text-text-300">
              Connect Wallet
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar;