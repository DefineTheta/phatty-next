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
  PUBLICONE: 'PUBLICONE'
} as const;

export type Portfolio = typeof PortfolioEnum[keyof typeof PortfolioEnum];

export const PublicBundleLookup: Portfolio[] = ['PUBLICONE'];

export const PublicBundleName: string[] = ['Bundle One'];

export const PublicBundleAddresses = [
  [
    '0x431e81e5dfb5a24541b5ff8762bdef3f32f96354',
    '0xeec0591c07000e41e88efd153801c3fc0a11f7f4',
    '0x3ddfa8ec3052539b6c9549f12cea2c295cff5296'
  ]
];

export const isArrayOfPortfolioChain = (chains: string[]): chains is PortfolioChain[] => {
  chains.forEach((chain) => {
    if (!(chain in PortfolioChainEnum)) return false;
  });

  return true;
};
