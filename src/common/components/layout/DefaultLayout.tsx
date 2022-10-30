import NavBar from '@app-src/common/components/layout/NavBar';
import SideBar from '@app-src/common/components/layout/SideBar';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { fetchBundleAddresses, setBundleAddress } from '@app-src/store/bundles/bundleSlice';
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

      window.ethereum.on('connect', () => {
        console.log('Metamask connected');
        dispatch(fetchBundleAddresses());
      });
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
