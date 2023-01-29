import memoize from 'proxy-memoize';
import { RootState } from '../store';

export const selectCheckerLoading = memoize((state: RootState) => {
  return state.checker.loading;
});

export const selectCheckerError = memoize((state: RootState) => {
  return state.checker.error;
});

export const selectCheckerHasFetched = memoize((state: RootState) => {
  return state.checker.hasFetched;
});

export const selectPhiatTransactions = memoize((state: RootState) => {
  return state.checker.data.phiatTransactions;
});

export const selectPhiatPoints = memoize((state: RootState) => {
  return state.checker.data.phiatPoints;
});

export const selectPhameTransactions = memoize((state: RootState) => {
  return state.checker.data.phameTransactions;
});

export const selectPhameTiers = memoize((state: RootState) => {
  return state.checker.data.phameTiers;
});

export const selectPhamePoints = memoize((state: RootState) => {
  return state.checker.data.phamePoints;
});

export const selectPhiatDataLength = memoize((state: RootState) => {
  return state.checker.data.phiatTransactions.length + state.checker.data.phiatPoints.length;
});

export const selectPhameDataLength = memoize((state: RootState) => {
  return (
    state.checker.data.phameTransactions.length +
    state.checker.data.phameTiers.length +
    state.checker.data.phamePoints.length
  );
});
