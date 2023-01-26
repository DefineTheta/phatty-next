import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';

type IChainDropdownSelectorProps = {
  currentChains: PortfolioChain[];
};

type ChainDataItem = {
  name: PortfolioChain;
  displayName: string;
  imgPath: string;
};

const ChainDropdownSelector = ({ currentChains }: IChainDropdownSelectorProps) => {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const chainData = useMemo<ChainDataItem[]>(
    () => [
      { name: 'ETH', displayName: 'Ethereum', imgPath: '/img/chains/eth.svg' },
      { name: 'BSC', displayName: 'BNB Chain', imgPath: '/img/chains/bsc.svg' },
      { name: 'TPLS', displayName: 'Pulsechain', imgPath: '/img/chains/tpls.svg' },
      { name: 'MATIC', displayName: 'Polygon', imgPath: '/img/chains/matic.svg' },
      { name: 'AVAX', displayName: 'Avalanche', imgPath: '/img/chains/avax.svg' },
      { name: 'FTM', displayName: 'Phantom', imgPath: '/img/chains/ftm.svg' },
      { name: 'ARBI', displayName: 'Arbitrum', imgPath: '/img/chains/arbi.svg' }
    ],
    []
  );

  const handleChainSelect = useCallback(
    (chain: PortfolioChain, event: SyntheticEvent<HTMLInputElement>) => {
      console.log();

      let updatedChains = [...currentChains];

      if (event.currentTarget.checked && !updatedChains.includes(chain)) {
        updatedChains.push(chain);
      } else if (!event.currentTarget.checked && updatedChains.includes(chain)) {
        updatedChains = updatedChains.filter((chainIterator) => chainIterator !== chain);
      }

      router.push(
        {
          pathname: router.asPath.split('?')[0],
          query: updatedChains.length > 0 ? { chains: updatedChains.join(',') } : undefined
        },
        undefined,
        {
          shallow: true
        }
      );
    },
    [currentChains, router]
  );

  return (
    <div className="relative">
      <div
        className="flex cursor-pointer flex-row items-center text-base font-bold text-text-200"
        onClick={() => setIsVisible((state) => !state)}
      >
        Chains
        <span className="ml-4 text-sm">{isVisible ? '▲' : '▼'}</span>
      </div>
      {isVisible && (
        <div className="absolute z-50 -ml-320 grid w-400 cursor-pointer grid-cols-2 gap-y-16 gap-x-24 bg-background-300 p-16 shadow-xl">
          {chainData.map((chain) => (
            <label
              key={chain.name}
              className="flex w-170 cursor-pointer flex-row items-center gap-x-10 rounded-md border border-border-200 py-10 px-16 text-text-200 hover:border-border-900 hover:border-opacity-60 hover:text-text-900 hover:text-opacity-80"
            >
              <input
                type="checkbox"
                className="mr-4"
                onClick={(event) => handleChainSelect(chain.name, event)}
                checked={currentChains.includes(chain.name)}
              />
              <div className="h-24 w-24 rounded-full">
                <Image src={chain.imgPath} width="24px" height="24px" alt={chain.name} />
              </div>
              <span className="text-md font-bold">{chain.displayName}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainDropdownSelector;
