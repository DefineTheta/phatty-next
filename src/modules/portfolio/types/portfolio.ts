export enum PortfolioPageEnum {
  PROFIL = 'PROFILE',
  BUNDLE = 'BUNDLE'
}

const PortfolioChainEnum = {
  '': '',
  ETH: 'ETH',
  BSC: 'BSC',
  TPLS: 'TPLS',
  MATIC: 'MATIC',
  AVAX: 'AVAX',
  FTM: 'FTM'
} as const;

export type PortfolioChain = typeof PortfolioChainEnum[keyof typeof PortfolioChainEnum];
