import useBreakpoint, { Breakpoint } from '@app-src/common/hooks/useBreakpoint';
import useClickOutside from '@app-src/common/hooks/useClickOutside';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import {
  Bars3Icon,
  EyeIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const SideBar = () => {
  const router = useRouter();

  const profileAddress = useSelector(useCallback(selectDisplayAddress(PortfolioEnum.PROFILE), []));
  const bundleAddress = useSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));

  const currentTab = useMemo(() => router.pathname.split('/').at(1), [router]);

  const [isVisible, setIsVisible] = useState(false);

  const { breakpoint, isScreenSizeLargerThan, isScreenSizeSmallerThan } = useBreakpoint();

  const handleClickOutside = useCallback(() => {
    if (isScreenSizeSmallerThan(Breakpoint.md)) setIsVisible(false);
  }, [isScreenSizeSmallerThan]);

  const handleNavClick = useCallback(
    (tabName: string) => {
      if (tabName === 'profile') {
        const route = profileAddress ? `/profile/${profileAddress}/portfolio` : '/profile';
        router.push(route);
        // router.push(`/profile/${cryptoAddress || ''}`);
      } else if (tabName === 'bundle') {
        const route = bundleAddress ? `/bundle/${bundleAddress}/portfolio` : '/bundle';
        router.push(route);
        // router.push(`/bundle/${bundleAddress || ''}`);
      } else if (tabName === 'public') {
        const route = '/public';
        router.push(route);
        // router.push(`/bundle/${bundleAddress || ''}`);
      } else if (tabName === 'phiat') {
        window.open('https://phiat.io/', '_blank')?.focus();
      } else if (tabName === 'phamous') {
        window.open('https://phamous.io/', '_blank')?.focus();
      } else if (tabName === 'hex') {
        window.open('https://hex.com/', '_blank')?.focus();
      } else if (tabName === 'hedron') {
        window.open('https://hedron.pro/#/', '_blank')?.focus();
      } else if (tabName === 'pulsex') {
        window.open('https://pulsex.com/', '_blank')?.focus();
      } else if (tabName === 'liquidloans') {
        window.open('http://liquidloans.io/', '_blank')?.focus();
      } else if (tabName === 'powercity') {
        window.open('https://powercity.io/', '_blank')?.focus();
      }
    },
    [router, profileAddress, bundleAddress]
  );

  const sidebarRef = useClickOutside(handleClickOutside);

  const navItems = useMemo(
    () => [
      {
        icon: <MagnifyingGlassIcon className="h-24 w-24" />,
        name: 'profile',
        displayName: 'Search'
      },
      {
        icon: <Squares2X2Icon className="h-24 w-24" />,
        name: 'bundle',
        displayName: 'Bundles'
      },
      {
        icon: <EyeIcon className="h-24 w-24" />,
        name: 'public',
        displayName: 'Public'
      },
      // {
      //   icon: <BanknotesIcon className="h-24 w-24" />,
      //   name: 'staking',
      //   displayName: 'Staking'
      // },
      {
        icon: <Image src="/img/icon/phiat.svg" alt="Phiat icon" width="24px" height="24px" />,
        name: 'phiat',
        displayName: 'Phiat'
      },
      {
        icon: <Image src="/img/icon/phamous.svg" alt="Phamous icon" width="24px" height="24px" />,
        name: 'phamous',
        displayName: 'Phamous'
      },
      {
        icon: (
          <Image
            src="/img/icon/hex.svg"
            alt="Hex icon"
            width="24px"
            height="24px"
            className="grayscale"
          />
        ),
        name: 'hex',
        displayName: 'Hex'
      },
      {
        icon: (
          <Image
            src="/img/icon/hedron.webp"
            alt="Hedron icon"
            width="24px"
            height="24px"
            className="grayscale"
          />
        ),
        name: 'hedron',
        displayName: 'Hedron'
      },
      {
        icon: (
          <Image
            src="/img/tokens/pulsex.jpeg"
            alt="PulseX icon"
            width="24px"
            height="24px"
            className="rounded-full grayscale"
          />
        ),
        name: 'pulsex',
        displayName: 'PulseX'
      },
      {
        icon: (
          <Image
            src="/img/icon/liquidloans.svg"
            alt="Liquid loans icon"
            width="24px"
            height="24px"
            className="grayscale"
          />
        ),
        name: 'liquidloans',
        displayName: 'Liquid Loans'
      },
      {
        icon: (
          <Image
            src="/img/icon/powercity.jpg"
            alt="Power city icon"
            width="24px"
            height="24px"
            className="rounded-full grayscale"
          />
        ),
        name: 'powercity',
        displayName: 'Power City'
      }
    ],
    []
  );

  return (
    <>
      <div
        ref={sidebarRef}
        className={`${
          isScreenSizeLargerThan(Breakpoint.md)
            ? 'sticky w-240 translate-x-0 p-0'
            : isVisible
            ? 'fixed w-220 translate-x-0 pt-5 pb-7 pl-7'
            : 'fixed w-0 -translate-x-full p-0'
        } z-40 h-screen overflow-hidden bg-background-300 transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-10 right-10 h-20 w-20 text-white sm:hidden"
        >
          <XMarkIcon />
        </button>
        <div className="flex h-full flex-col justify-between pt-20 pb-30 pl-20 sm:pl-30">
          <div className="flex flex-col gap-y-50">
            <a href="/">
              <Image src="/img/logo-light.png" alt="Logo" width="140px" height="36px" />
            </a>
            <div className="flex flex-col gap-y-24">
              {navItems.map((item, index) => (
                <>
                  {index === 5 && <div className="mr:20 my-20 h-1 bg-gray-500 sm:mr-30"></div>}
                  <a
                    key={item.name}
                    className={`flex cursor-pointer items-center gap-x-12 duration-150 ease-in-out hover:text-gray-200 ${
                      currentTab === item.name
                        ? 'border-r-4 border-secondary text-gray-200'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleNavClick(item.name)}
                  >
                    {item.icon}
                    <span className="text-base font-bold">{item.displayName}</span>
                  </a>
                </>
              ))}
            </div>
          </div>
          <a
            href="https://t.me/phattycrypto"
            target="_blank"
            rel="noopener nofollow noreferrer"
            className="flex cursor-pointer flex-row gap-x-12 text-gray-400 duration-150 ease-in-out hover:text-gray-200"
          >
            <FlagIcon className="h-24 w-24" />
            <span className="text-base font-bold">Report Issue</span>
          </a>
        </div>
      </div>
      <button
        className="absolute top-16 left-4 z-30 block md:hidden"
        onClick={() => setIsVisible(true)}
      >
        <Bars3Icon className="h-24 w-24 text-white" />
      </button>
    </>
  );
};

export default SideBar;
