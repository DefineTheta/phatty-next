import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddress } from '@app-src/common/utils/format';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { fetchPortfolioData } from '@app-src/store/portfolio/portfolioSlice';
import { selectChainsTotal, selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { PortfolioEnum } from '@app-src/store/portfolio/types';
import { CalendarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

type IProfileHeaderProps = {
  address: string;
  currentChains: PortfolioChain[];
};

const ProfileHeader = ({ address, currentChains }: IProfileHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const bundleAddress = useAppSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));

  const total = useAppSelector(
    useCallback(selectChainsTotal(currentChains, PortfolioEnum.PROFILE), [currentChains])
  );
  const styledTotal = useMemo(() => formatToMoney(total), [total]);

  const currentTab = useMemo(
    () => router.asPath.toLowerCase().split('/').at(-1)?.split('?')[0],
    [router.asPath]
  );

  const tabs = useMemo(
    () => [
      {
        displayName: 'Portfolio',
        name: 'portfolio',
        href: `/profile/${encodeURIComponent(address)}/portfolio`
      },
      {
        displayName: 'NFT',
        name: 'nft',
        href: `/profile/${encodeURIComponent(address)}/portfolio`
      },
      {
        displayName: 'History',
        name: 'history',
        href: `/profile/${encodeURIComponent(address)}/history`
      }
    ],
    [address]
  );

  const handleRefreshDataClick = useCallback(() => {
    fetchPortfolioData(dispatch, [address], PortfolioEnum.PROFILE, true);
  }, [dispatch, address]);

  return (
    <div className="flex flex-row justify-center bg-background-200 pt-36">
      <Container>
        <div className="flex flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-start gap-y-12">
              <div className="flex flex-row items-center gap-x-6">
                <span className="text-lg font-semibold tracking-wide text-text-200" title={address}>
                  {truncateAddress(address)}
                </span>
              </div>
              <div className="flex flex-row items-center gap-x-18">
                {bundleAddress && (
                  <button className="flex cursor-pointer flex-row items-center gap-x-6 rounded-full bg-purple-button py-6 px-12 drop-shadow-md">
                    <TrophyIcon className="h-14 w-14 text-white" />
                    <span className="text-sm text-white">Early Supporter</span>
                  </button>
                )}
                <button
                  className="flex cursor-pointer flex-row items-center gap-x-6 rounded-full bg-bluegray-button py-6 px-12 drop-shadow-md"
                  onClick={handleRefreshDataClick}
                >
                  <CalendarIcon className="h-14 w-14 text-white" />
                  <span className="text-sm text-white">Refresh Data</span>
                </button>
              </div>
            </div>
            <span className="text-2xl font-black text-text-100">{styledTotal}</span>
          </div>
          <div className="flex flex-row items-center gap-x-30">
            {tabs.map((tab) => (
              <Link key={tab.name} href={address ? tab.href : '/profile'}>
                <a
                  key={tab.name}
                  className={`cursor-pointer px-10 pb-6 text-base font-bold ${
                    tab.name === currentTab
                      ? 'border-b-4 border-text-900 text-text-900'
                      : 'text-text-200'
                  }`}
                >
                  {tab.displayName}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfileHeader;
