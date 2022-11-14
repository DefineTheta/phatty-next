import { Dispatch, SetStateAction, useState } from 'react';

const useFilter = <T,>(
  data: T[],
  filterKey: keyof T,
  filterAmount: number
): [T[], boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isFiltered, setIsFiltered] = useState(true);

  if (isFiltered) {
    return [data.filter((item) => item[filterKey] > filterAmount), isFiltered, setIsFiltered];
  } else {
    return [data, isFiltered, setIsFiltered];
  }
};

export default useFilter;
