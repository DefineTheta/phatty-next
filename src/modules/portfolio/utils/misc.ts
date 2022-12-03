import { PortfolioChain } from '../types/portfolio';

type IsInCurrentChainsFunc = {
  (chain: PortfolioChain, currentChains: PortfolioChain[]): boolean;
  (chain: PortfolioChain[], currentChains: PortfolioChain[]): boolean;
};

export const isInCurrentChains: IsInCurrentChainsFunc = (
  chain: PortfolioChain | PortfolioChain[],
  currentChains: PortfolioChain[]
) => {
  if (currentChains.length === 0) return true;

  if (typeof chain === 'string') return currentChains.includes(chain);
  else return currentChains.some((item) => chain.includes(item));
};
