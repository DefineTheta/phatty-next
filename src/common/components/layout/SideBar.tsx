import useBreakpoint from '@app-src/common/hooks/useBreakpoint';
import useClickOutside from '@app-src/common/hooks/useClickOutside';
import {
  BanknotesIcon,
  Bars3Icon,
  Squares2X2Icon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

const SideBar = () => {
  const router = useRouter();

  const currentTab = useMemo(() => router.pathname.split('/').at(1), [router]);

  const [isVisible, setIsVisible] = useState(false);

  const breakpoint = useBreakpoint();

  const handleClickOutside = useCallback(() => {
    if (breakpoint === 'xs') setIsVisible(false);
  }, [breakpoint]);

  const handleNavClick = useCallback(
    (tabName: string) => {
      if (tabName === 'profile') {
        router.push(`/profile`);
        // router.push(`/profile/${cryptoAddress || ''}`);
      } else if (tabName === 'bundle') {
        router.push(`/bundle/asd/portfolio`);
        // router.push(`/bundle/${bundleAddress || ''}`);
      } else if (tabName === 'phiat') {
        window.open('https://phiat.io/', '_blank')?.focus();
      } else if (tabName === 'phamous') {
        window.open('https://phamous.io/', '_blank')?.focus();
      }
    },
    [router]
  );

  const sidebarRef = useClickOutside(handleClickOutside);

  const navItems = useMemo(
    () => [
      {
        icon: <UserIcon className="w-24 h-24" />,
        name: 'profile',
        displayName: 'Profile'
      },
      {
        icon: <Squares2X2Icon className="w-24 h-24" />,
        name: 'bundle',
        displayName: 'Bundles'
      },
      {
        icon: <BanknotesIcon className="w-24 h-24" />,
        name: 'staking',
        displayName: 'Staking'
      },
      {
        icon: <Image src="/img/icon/phiat.svg" alt="Phiat icon" width="24px" height="24px" />,
        name: 'phiat',
        displayName: 'Phiat'
      },
      {
        icon: <Image src="/img/icon/phamous.svg" alt="Phamous icon" width="24px" height="24px" />,
        name: 'phamous',
        displayName: 'Phamous'
      }
    ],
    []
  );

  return (
    <>
      <div
        ref={sidebarRef}
        className={`${
          breakpoint !== 'xs'
            ? 'translate-x-0 w-240 p-0 sticky'
            : isVisible
            ? 'translate-x-0 w-220 pt-5 pb-7 pl-7 fixed'
            : '-translate-x-full w-0 p-0 fixed'
        } h-screen bg-background-300 ease-in-out duration-300 transition-transform overflow-hidden z-20`}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="w-20 h-20 absolute top-10 right-10 text-white sm:hidden"
        >
          <XMarkIcon />
        </button>
        <div className="h-full pt-20 pb-30 pl-20 sm:pl-30 flex flex-col justify-between">
          <div className="flex flex-col gap-y-50">
            <a>
              <Image src="/img/logo-light.png" alt="Logo" width="140px" height="36px" />
            </a>
            <div className="flex flex-col gap-y-24">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  className={`flex items-center gap-x-12 cursor-pointer hover:text-gray-200 ease-in-out duration-150 ${
                    currentTab === item.name
                      ? 'border-r-4 border-secondary text-gray-200'
                      : 'text-gray-400'
                  }`}
                  onClick={() => handleNavClick(item.name)}
                >
                  {item.icon}
                  <span className="text-base font-bold">{item.displayName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="absolute top-6 left-4 block sm:hidden" onClick={() => setIsVisible(true)}>
        <Bars3Icon className="w-24 h-24 text-white" />
      </button>
    </>
  );
};

export default SideBar;
