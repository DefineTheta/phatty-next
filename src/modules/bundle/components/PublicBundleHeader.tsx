import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import {
  Portfolio,
  PortfolioChain,
  PortfolioEnum
} from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { fetchPortfolioData } from '@app-src/store/portfolio/portfolioSlice';
import {
  selectAddresses,
  selectChainsTotal,
  selectDisplayAddress
} from '@app-src/store/portfolio/selectors';
import { CalendarIcon, DocumentDuplicateIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

type IPublicBundleHeaderProps = {
  page: Portfolio;
  currentChains: PortfolioChain[];
  displayName: string;
};

const PublicBundleHeader = ({ page, currentChains, displayName }: IPublicBundleHeaderProps) => {
  const dispatch = useAppDispatch();

  const total = useAppSelector(
    useCallback(selectChainsTotal(currentChains, page), [page, currentChains])
  );
  const privateBundleAddress = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), [])
  );
  const bundleAddresses = useAppSelector(useCallback(selectAddresses(page), [page]));

  const styledTotal = useMemo(() => formatToMoney(total), [total]);
  const currentTab = useMemo(() => 'public', []);

  const tabs = useMemo(
    () => [
      {
        displayName: 'Portfolio',
        name: 'portfolio',
        href: `/bundle/${encodeURIComponent(privateBundleAddress)}/portfolio`
      },
      {
        displayName: 'Public',
        name: 'public',
        href: `/bundle/public/public`
      },
      {
        displayName: 'NFT',
        name: 'nft',
        href: `/bundle/${encodeURIComponent(privateBundleAddress)}/portfolio`
      },
      {
        displayName: 'History',
        name: 'history',
        href: `/bundle/${encodeURIComponent(privateBundleAddress)}/portfolio`
      },
      {
        displayName: 'Accounts',
        name: 'account',
        href: `/bundle/${encodeURIComponent(privateBundleAddress)}/account`
      }
    ],
    [privateBundleAddress]
  );

  // const handleAddressCopyClick = useCallback(() => {
  //   navigator.clipboard.writeText(address);
  //   toast.success(<span className="text-md font-bold">Address copied!</span>);
  // }, [address]);

  const handleRefreshDataClick = useCallback(() => {
    fetchPortfolioData(dispatch, bundleAddresses, PortfolioEnum.BUNDLE, true);
  }, [dispatch, bundleAddresses]);

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
                <button
                  className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gray-100"
                  data-tip="Copy wallet address"
                >
                  <DocumentDuplicateIcon className="h-12 w-12" />
                </button>
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
                  onClick={handleRefreshDataClick}
                >
                  <CalendarIcon className="h-14 w-14 text-white" />
                  <span className="text-sm text-white">Refresh Data</span>
                </button>
              </div>
            </div>
            {/* <span className="text-lg font-semibold text-text-200">{truncateAddress(address)}</span> */}
            <span className="text-2xl font-black text-text-100">{styledTotal}</span>
          </div>
          <div className="flex flex-row items-center gap-x-30">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={privateBundleAddress || tab.name === 'public' ? tab.href : '/bundle'}
              >
                <a
                  className={`cursor-pointer px-10 pb-6 text-base font-bold ${
                    tab.name === currentTab
                      ? 'border-b-4 border-text-900 text-text-900'
                      : 'text-text-200'
                  }`}
                  // onClick={() => router.push(`/${router.pathname}/${tab.name}`)}
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

export default PublicBundleHeader;
