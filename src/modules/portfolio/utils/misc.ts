import { PortfolioChain } from '../types/portfolio';

export const isCurrentChain = (chain: PortfolioChain, currentChain: PortfolioChain) => {
  if (currentChain === '' || chain === currentChain) return true;
  else return false;
};

export const isCurrentChainIn = (chains: PortfolioChain[], currentChain: PortfolioChain) => {
  if (currentChain === '' || chains.includes(currentChain)) return true;
  else return false;
};
