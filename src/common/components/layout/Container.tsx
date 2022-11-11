import { ReactNode } from 'react';

export type IContainerProps = {
  children?: ReactNode;
};

const Container = ({ children }: IContainerProps) => {
  return <div className="w-full max-w-96 px-12">{children}</div>;
};

export default Container;
