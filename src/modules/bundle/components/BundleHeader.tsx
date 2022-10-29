import { formatToMoney } from '@app-src/modules/portfolio/utils/format';
import { selectBundleTotal } from '@app-src/store/bundles/selectors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

const BundleHeader = () => {
  const router = useRouter();
  const address = String(router.query.address);

  const total = useSelector(useCallback(selectBundleTotal, []));
  const styledTotal = useMemo(() => formatToMoney(total), [total]);

  const currentTab = useMemo(() => router.asPath.toLowerCase().split('/').at(-1), [router.asPath]);

  const tabs = useMemo(
    () => [
      {
        displayName: 'Portfolio',
        name: 'portfolio'
      },
      {
        displayName: 'NFT',
        name: 'nft'
      },
      {
        displayName: 'History',
        name: 'history'
      },
      {
        displayName: 'Accounts',
        name: 'account'
      }
    ],
    []
  );

  return (
    <div className="pt-36 flex flex-row justify-center bg-background-200">
      <div className="w-full max-w-96 flex flex-col gap-y-30">
        <div className="flex flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <span className="text-lg font-semibold text-text-200">test</span>
            <span className="text-2xl font-black text-text-100">{styledTotal}</span>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-x-30">
            {tabs.map((tab) => (
              <Link key={tab.name} href={`/bundle/${encodeURIComponent(address)}/${tab.name}`}>
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
