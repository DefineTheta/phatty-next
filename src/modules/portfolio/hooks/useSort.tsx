import { tableSort } from '@app-src/modules/portfolio/utils/table';
import { useMemo, useState } from 'react';

const useSort = <T,>(
  data: T[],
  dataSortKey: string,
  dataSortOrder: 'asc' | 'desc'
): [T[], string, 'asc' | 'desc', (key: string) => void] => {
  const [sortKey, setSortKey] = useState(dataSortKey);
  const [sortOrder, setSortOrder] = useState(dataSortOrder);

  const handleTableHeaderClick = (key: string) => {
    if (key === sortKey) {
      setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    return tableSort(data, sortKey, sortOrder);
  }, [data, sortKey, sortOrder]);

  return [sortedData, sortKey, sortOrder, handleTableHeaderClick];
};

export default useSort;
