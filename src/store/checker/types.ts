import { CheckerResponse } from '@app-src/server/checker';

export type CheckerData = {
  hasFetched: boolean;
  loading: boolean;
  error: boolean;
  data: CheckerResponse;
};

export const SectionEnum = {
  PROFILE: 'PROFILE',
  BUNDLE: 'BUNDLE'
} as const;

export type Section = typeof SectionEnum[keyof typeof SectionEnum];

export type CheckerState = Record<Section, CheckerData>;
