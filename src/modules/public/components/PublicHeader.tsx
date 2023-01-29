import Container from '@app-src/common/components/layout/Container';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainDropdownSelector from '@app-src/modules/chain/components/ChainDropdownSelector';
import { PortfolioChain, PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { CalendarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';

type IPublicBundleHeaderProps = {
  displayName: string;
  currentChains: PortfolioChain[];
  total: string;
  onRefreshData: () => void;
};

const PublicHeader = ({
  displayName,
  currentChains,
  total,
  onRefreshData
}: IPublicBundleHeaderProps) => {
  const privateBundleAddress = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), [])
  );

  return (
    <div className="flex flex-row justify-center bg-background-200 pt-36">
      <Container>
        <div className="flex w-full max-w-96 flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-start gap-y-12">
              <div className="flex flex-row items-center gap-x-6">
                <span
                  className="text-lg font-semibold tracking-wide text-text-200"
                  title={displayName}
                >
                  {displayName}
                </span>
              </div>
              <div className="flex flex-row items-center gap-x-18">
                {privateBundleAddress && (
                  <button className="flex cursor-pointer flex-row items-center gap-x-6 rounded-full bg-purple-button py-6 px-12 drop-shadow-md">
                    <TrophyIcon className="h-14 w-14 text-white" />
                    <span className="text-sm text-white">Early Supporter</span>
                  </button>
                )}
                <button
                  className="flex cursor-pointer flex-row items-center gap-x-6 rounded-full bg-bluegray-button py-6 px-12 drop-shadow-md"
                  onClick={onRefreshData}
                >
                  <CalendarIcon className="h-14 w-14 text-white" />
                  <span className="text-sm text-white">Refresh Data</span>
                </button>
              </div>
            </div>
            {/* <span className="text-lg font-semibold text-text-200">{truncateAddress(address)}</span> */}
            <span className="text-2xl font-black text-text-100">{total}</span>
          </div>
          <div className="flex flex-row items-center justify-end pb-2">
            <ChainDropdownSelector currentChains={currentChains} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PublicHeader;
