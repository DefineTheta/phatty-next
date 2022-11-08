import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddress } from '@app-src/common/utils/format';
import { PortfolioChain } from '@app-src/modules/portfolio/types/portfolio';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { fetchBundlePortfolioData } from '@app-src/store/bundles/bundleSlice';
import {
  selectBundleAddresses,
  selectBundleBscTotal,
  selectBundleEthereumTotal,
  selectBundleTotal,
  selectBundleTplsTotal
} from '@app-src/store/bundles/selectors';
import { CalendarIcon, DocumentDuplicateIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

type IBundleHeaderProps = {
  address: string;
  chain: PortfolioChain;
};

const BundleHeader = ({ address, chain }: IBundleHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const total = useAppSelector(
    useCallback(
      chain === 'ETH'
        ? selectBundleEthereumTotal
        : chain === 'BSC'
        ? selectBundleBscTotal
        : chain === 'TPLS'
        ? selectBundleTplsTotal
        : selectBundleTotal,
      [chain]
    )
  );
  const bundleAddresses = useAppSelector(useCallback(selectBundleAddresses, []));

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
        href: `/bundle/${encodeURIComponent(address)}/portfolio`
      },
      {
        displayName: 'NFT',
        name: 'nft',
        href: `/bundle/${encodeURIComponent(address)}/portfolio`
      },
      {
        displayName: 'History',
        name: 'history',
        href: `/bundle/${encodeURIComponent(address)}/portfolio`
      },
      {
        displayName: 'Accounts',
        name: 'account',
        href: `/bundle/${encodeURIComponent(address)}/account`
      }
    ],
    [address]
  );

  const handleAddressCopyClick = useCallback(() => {
    navigator.clipboard.writeText(address);
    toast.success(<span className="text-md font-bold">Address copied!</span>);
  }, [address]);

  const handleRefreshDataClick = useCallback(() => {
    fetchBundlePortfolioData(dispatch, bundleAddresses, true);
  }, [dispatch, bundleAddresses]);

  return (
    <div className="pt-36 flex flex-row justify-center bg-background-200">
      <div className="w-full max-w-96 flex flex-col gap-y-30">
        <div className="flex flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-12 items-start">
              <div className="flex flex-row items-center gap-x-6">
                <span className="text-lg font-semibold text-text-200 tracking-wide" title={address}>
                  {truncateAddress(address)}
                </span>
                <button
                  className="w-20 h-20 flex justify-center items-center cursor-pointer bg-gray-100 rounded-full"
                  data-tip="Copy wallet address"
                  onClick={handleAddressCopyClick}
                >
                  <DocumentDuplicateIcon className="w-12 h-12" />
                </button>
              </div>
              <div className="flex flex-row gap-x-18 items-center">
                <button className="py-6 px-12 flex flex-row items-center gap-x-6 bg-purple-button rounded-full cursor-pointer drop-shadow-md">
                  <TrophyIcon className="w-14 h-14 text-white" />
                  <span className="text-sm text-white">Early Supporter</span>
                </button>
                <button
                  className="py-6 px-12 flex flex-row items-center gap-x-6 bg-bluegray-button rounded-full cursor-pointer drop-shadow-md"
                  onClick={handleRefreshDataClick}
                >
                  <CalendarIcon className="w-14 h-14 text-white" />
                  <span className="text-sm text-white">Refresh Data</span>
                </button>
              </div>
            </div>
            {/* <span className="text-lg font-semibold text-text-200">{truncateAddress(address)}</span> */}
            <span className="text-2xl font-black text-text-100">{styledTotal}</span>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-x-30">
            {tabs.map((tab) => (
              <Link key={tab.name} href={address ? tab.href : '/bundle'}>
                <a
                  className={`px-10 pb-6 text-base font-bold cursor-pointer ${
                    tab.name === currentTab
                      ? 'text-text-900 border-b-4 border-text-900'
                      : 'text-text-200'
                  }`}
                  // onClick={() => router.push(`/${router.pathname}/${tab.name}`)}
                >
                  {tab.displayName}
                </a>
              </Link>
            ))}
          </div>
          <span className="text-sm text-text-200">Data updated now</span>
        </div>
      </div>
    </div>
  );
};

export default BundleHeader;
