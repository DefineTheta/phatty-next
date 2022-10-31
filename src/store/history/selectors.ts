import memoize from 'proxy-memoize';
import { RootState } from '../store';

export const selectProfileHistory = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HISTORY');

  return state.history.data;
});

export const selectProfileHistoryFetched = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HISTORY_FETCHED');

  return state.history.hasFetched;
});

export const selectProfileHistoryLoading = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HISTORY_LOADING');

  return state.history.loading;
});

export const selectProfileHistoryError = memoize((state: RootState) => {
  console.log('SELECT_PROFILE_HISTORY_ERROR');

  return state.history.error;
});
