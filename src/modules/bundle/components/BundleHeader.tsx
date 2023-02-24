import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainDropdownSelector from '@app-src/modules/chain/components/ChainDropdownSelector';
import { PortfolioChain, PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { selectCurrentBundle } from '@app-src/store/bundle/selectors';
import { fetchPortfolioData } from '@app-src/store/portfolio/portfolioSlice';
import { selectChainsTotal } from '@app-src/store/portfolio/selectors';
import { CalendarIcon, DocumentDuplicateIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

type IBundleHeaderProps = {
  currentChains: PortfolioChain[];
};

const BundleHeader = ({ currentChains }: IBundleHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { status: authStatus } = useSession();

  const total = useAppSelector(
    useCallback(selectChainsTotal(currentChains, PortfolioEnum.BUNDLE), [currentChains])
  );
  const currentBundle = useAppSelector(useCallback(selectCurrentBundle, []));

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
        href: currentBundle
          ? `/bundles/${encodeURIComponent(currentBundle.id)}/portfolio`
          : '/bundles'
      },
      {
        displayName: 'Checker',
        name: 'checker',
        href: `/bundles/checker`
      },
      {
        displayName: 'History',
        name: 'history',
        href: currentBundle
          ? `/bundles/${encodeURIComponent(currentBundle.id)}/portfolio`
          : '/bundles'
      },
      {
        displayName: 'Accounts',
        name: 'account',
        href: currentBundle
          ? `/bundles/${encodeURIComponent(currentBundle.id)}/account`
          : '/bundles'
      }
    ],
    [currentBundle]
  );

  const handleAddressCopyClick = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(<span className="text-md font-bold">Link copied!</span>);
  }, []);

  const handleRefreshDataClick = useCallback(() => {
    if (!currentBundle) return;

    const controller = new AbortController();

    fetchPortfolioData(
      dispatch,
      currentBundle.addresses,
      PortfolioEnum.BUNDLE,
      controller.signal,
      true
    );

    return () => controller.abort();
  }, [dispatch, currentBundle]);

  return (
    <div className="flex flex-row justify-center bg-background-200 pt-36">
      <Container>
        <div className="flex w-full max-w-96 flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-start gap-y-12">
              <div className="flex flex-row items-center gap-x-6">
                <span className="text-lg font-semibold tracking-wide text-text-200">
                  {currentBundle?.name || ''}
                </span>
                <button
                  className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gray-100"
                  data-tip="Copy wallet address"
                  onClick={handleAddressCopyClick}
                >
                  <DocumentDuplicateIcon className="h-12 w-12" />
                </button>
              </div>
              <div className="flex flex-row items-center gap-x-18">
                {authStatus === 'authenticated' && (
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
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-x-30">
              {tabs.map((tab) => (
                <Link key={tab.name} href={tab.href}>
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
            <ChainDropdownSelector currentChains={currentChains} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BundleHeader;
