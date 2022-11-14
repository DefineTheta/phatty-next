import { Dispatch, SetStateAction, useState } from 'react';

const useLimit = <T,>(
  data: T[],
  limitAmount: number
): [T[], boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isLimited, setIsLimited] = useState(true);

  if (isLimited) {
    return [data.slice(0, limitAmount), isLimited, setIsLimited];
  } else {
    return [data, isLimited, setIsLimited];
  }
};

export default useLimit;
