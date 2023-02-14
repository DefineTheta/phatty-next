import memoize from 'proxy-memoize';
import { RootState } from '../store';
import { Section } from './types';

export const selectCheckerLoading = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].loading;
  });

export const selectCheckerError = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].error;
  });

export const selectCheckerHasFetched = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].hasFetched;
  });

export const selectPhiatTransactions = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].data.phiatTransactions;
  });

export const selectPhiatPoints = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].data.phiatPoints;
  });

export const selectPhameTransactions = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].data.phameTransactions;
  });

export const selectPhameTiers = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].data.phameTiers;
  });

export const selectPhamePoints = (type: Section) =>
  memoize((state: RootState) => {
    return state.checker[type].data.phamePoints;
  });

export const selectPhiatDataLength = (type: Section) =>
  memoize((state: RootState) => {
    return (
      state.checker[type].data.phiatTransactions.length +
      state.checker[type].data.phiatPoints.length
    );
  });

export const selectPhameDataLength = (type: Section) =>
  memoize((state: RootState) => {
    return (
      state.checker[type].data.phameTransactions.length +
      state.checker[type].data.phameTiers.length +
      state.checker[type].data.phamePoints.length
    );
  });
