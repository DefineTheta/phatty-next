import { CheckerResponse } from '@app-src/server/checker';

export type CheckerState = {
  hasFetched: boolean;
  loading: boolean;
  error: boolean;
  data: CheckerResponse;
};
