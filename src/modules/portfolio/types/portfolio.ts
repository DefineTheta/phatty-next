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

export const isArrayOfPortfolioChain = (chains: string[]): chains is PortfolioChain[] => {
  chains.forEach((chain) => {
    if (!(chain in PortfolioChainEnum)) return false;
  });

  return true;
};
