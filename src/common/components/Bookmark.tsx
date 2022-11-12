import { ReactNode } from 'react';

export type IBookmarkType = {
  children?: ReactNode;
};

const Bookmark = ({ children }: IBookmarkType) => {
  return (
    <div className="-mt-14 -ml-20 mb-14 w-fit rounded-r-md bg-background-800 py-2 px-24 text-sm font-bold text-text-700">
      {children}
    </div>
  );
};

export default Bookmark;
