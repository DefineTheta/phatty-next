import { truncateAddress } from '@app-src/common/utils/format';
import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { selectBundleTotal } from '@app-src/store/bundles/selectors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

type IBundleHeaderProps = {
  address: string;
};

const BundleHeader = ({ address }: IBundleHeaderProps) => {
  const router = useRouter();

  const total = useSelector(useCallback(selectBundleTotal, []));
  const styledTotal = useMemo(() => formatToMoney(total), [total]);

  const currentTab = useMemo(() => router.asPath.toLowerCase().split('/').at(-1), [router.asPath]);

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

  return (
    <div className="pt-36 flex flex-row justify-center bg-background-200">
      <div className="w-full max-w-96 flex flex-col gap-y-30">
        <div className="flex flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <span className="text-lg font-semibold text-text-200">{truncateAddress(address)}</span>
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
