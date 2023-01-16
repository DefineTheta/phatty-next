import { PortfolioChain, PortfolioProtocol } from '../types/portfolio';

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

const chainProtocols: { [key in PortfolioChain]: PortfolioProtocol[] } = {
  ETH: ['WALLET', 'HEX', 'SUSHI', 'UNISWAPV2', 'UNISWAPV3', 'HEDRON', 'XEN', 'ICOSA'],
  BSC: ['WALLET', 'PANCAKE'],
  TPLS: ['WALLET', 'HEX', 'HEDRON', 'PHAMOUS'],
  MATIC: ['WALLET'],
  AVAX: ['WALLET'],
  FTM: ['WALLET'],
  ARBI: ['WALLET']
};

export const isProtocolInCurrnetChains = (
  protocol: PortfolioProtocol,
  currentChains: PortfolioChain[]
) => {
  if (currentChains.length === 0) return true;

  for (let i = 0; i < currentChains.length; i++) {
    if (chainProtocols[currentChains[i]].includes(protocol)) return true;
  }

  return false;
};
