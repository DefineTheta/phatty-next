import NavBar from '@app-src/common/components/layout/NavBar';
import SideBar from '@app-src/common/components/layout/SideBar';
import { ReactNode } from 'react';

type IDefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
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
