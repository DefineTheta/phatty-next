import NavBar from '@app-src/common/components/layout/NavBar';
import SideBar from '@app-src/common/components/layout/SideBar';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import {
  clearBundleAddresses,
  setBundleAddress,
  setBundleFetched
} from '@app-src/store/bundles/bundleSlice';
import { setProfileAddress } from '@app-src/store/protocol/protocolSlice';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import Footer from './Footer';

type IDefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(window.ethereum);

    if (window.ethereum) {
      console.log('Is metamask connected?', window.ethereum.isConnected());

      if (sessionStorage.getItem('connected') == 'true') {
        window.ethereum?.request<string[]>({ method: 'eth_requestAccounts' }).then((accounts) => {
          console.log(accounts);
          if (accounts && accounts.length !== 0 && accounts[0]) {
            dispatch(setBundleAddress(accounts[0]));
          }
        });
      }

      const handleAccountChange = (accounts: unknown) => {
        console.log('Metamask accounts change');
        let acc = accounts as string[];
        if (acc && acc.length !== 0 && acc[0]) {
          dispatch(setBundleAddress(acc[0]));
          dispatch(clearBundleAddresses());
          dispatch(setBundleFetched(false));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountChange);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountChange);
      };

      // window.ethereum.on('connect', () => {
      //   console.log('Metamask connected');
      //   dispatch(fetchBundleAddresses());
      // });
    }
  }, []);

  useEffect(() => {
    const arr = router.asPath.split('/');

    if (arr.length > 3 && arr[2] !== '[address]') {
      if (arr[1] === 'profile') dispatch(setProfileAddress(arr[2]));
    }
  }, [router.asPath]);

  return (
    <div className="w-full flex flex-row bg-background-100">
      <Toaster />
      <ReactTooltip effect="solid" />
      <SideBar />
      <div className="w-full h-screen flex flex-col justify-between overflow-y-auto">
        <div>
          <NavBar />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
