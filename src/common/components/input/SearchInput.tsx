import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { KeyboardEvent, RefObject } from 'react';

interface ISearchInputProps {
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const SearchInput = ({ onKeyDown, inputRef }: ISearchInputProps) => {
  return (
    <div className="w-360 h-36 px-12 flex flex-row gap-x-6 justify-between items-center bg-background-300 rounded-full border border-border-100">
      <MagnifyingGlassIcon className="w-20 h-20 text-text-100" />
      <input
        type="text"
        autoComplete="off"
        placeholder="Search address"
        onKeyDown={onKeyDown}
        ref={inputRef}
        className="w-full text-base text-text-100 bg-background-300 border-none placeholder:font-bold placeholder:text-opacity-60 focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
