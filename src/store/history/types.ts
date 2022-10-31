import { HistoryItem } from '@app-src/types/api';

export type HistoryState = {
  hasFetched: boolean;
  loading: boolean;
  error: boolean;
  data: HistoryItem[];
};
