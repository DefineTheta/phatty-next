export enum PortfolioPageEnum {
  PROFIL = 'PROFILE',
  BUNDLE = 'BUNDLE'
}

export enum PortfolioChainEnum {
  '' = '',
  ETH = 'ETH',
  BSC = 'BSC',
  TPLS = 'TPLS'
}

export type PortfolioChain = keyof typeof PortfolioChainEnum;
