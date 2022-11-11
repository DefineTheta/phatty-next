import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { KeyboardEvent, RefObject } from 'react';

interface ISearchInputProps {
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const SearchInput = ({ onKeyDown, inputRef }: ISearchInputProps) => {
  return (
    <div className="flex h-36 w-360 flex-row items-center justify-between gap-x-6 rounded-full border border-border-100 bg-background-300 px-12">
      <MagnifyingGlassIcon className="h-20 w-20 text-text-100" />
      <input
        type="text"
        autoComplete="off"
        placeholder="Search address"
        onKeyDown={onKeyDown}
        ref={inputRef}
        className="w-full border-none bg-background-300 text-base text-text-100 placeholder:font-bold placeholder:text-opacity-60 focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
