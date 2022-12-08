export enum PortfolioPageEnum {
  PROFIL = 'PROFILE',
  BUNDLE = 'BUNDLE'
}

const PortfolioChainEnum = {
  ETH: 'ETH',
  BSC: 'BSC',
  TPLS: 'TPLS',
  MATIC: 'MATIC',
  AVAX: 'AVAX',
  FTM: 'FTM'
} as const;

export type PortfolioChain = typeof PortfolioChainEnum[keyof typeof PortfolioChainEnum];

export const PortfolioEnum = {
  PROFILE: 'PROFILE',
  BUNDLE: 'BUNDLE',
  PUBLIC: 'PUBLIC'
} as const;

export type Portfolio = typeof PortfolioEnum[keyof typeof PortfolioEnum];

export const isArrayOfPortfolioChain = (chains: string[]): chains is PortfolioChain[] => {
  chains.forEach((chain) => {
    if (!(chain in PortfolioChainEnum)) return false;
  });

  return true;
};
