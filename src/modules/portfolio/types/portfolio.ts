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
  FTM: 'FTM',
  ARBI: 'ARBI'
} as const;

export type PortfolioChain = typeof PortfolioChainEnum[keyof typeof PortfolioChainEnum];

const PortfolioProtocolEnum = {
  WALLET: 'WALLET',
  HEX: 'HEX',
  PHIAT: 'PHIAT',
  PULSEX: 'PULSEX',
  PANCAKE: 'PANCAKE',
  SUSHI: 'SUSHI',
  UNISWAPV2: 'UNISWAPV2',
  UNISWAPV3: 'UNISWAPV3',
  HEDRON: 'HEDRON',
  PHAMOUS: 'PHAMOUS',
  XEN: 'XEN',
  ICOSA: 'ICOSA'
} as const;

export type PortfolioProtocol = typeof PortfolioProtocolEnum[keyof typeof PortfolioProtocolEnum];

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
