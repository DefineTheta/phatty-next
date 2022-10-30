import NavBar from '@app-src/common/components/layout/NavBar';
import SideBar from '@app-src/common/components/layout/SideBar';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import {
  clearBundleAddresses,
  setBundleAddress,
  setBundleFetched
} from '@app-src/store/bundles/bundleSlice';
import { ReactNode, useEffect } from 'react';

type IDefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(window.ethereum);

    if (window.ethereum) {
      console.log('Is metamask connected?', window.ethereum.isConnected());

      if (window.ethereum.isConnected()) {
        window.ethereum?.request<string[]>({ method: 'eth_requestAccounts' }).then((accounts) => {
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

  return (
    <div className="w-full flex flex-row bg-background-100">
      <SideBar />
      <div className="w-full h-screen flex flex-col overflow-y-auto">
        <NavBar />
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
