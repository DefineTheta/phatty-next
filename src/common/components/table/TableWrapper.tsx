import { ReactNode } from 'react';
import TableError from './TableError';

export type ITableWrapperProps = {
  error: boolean;
  handleRetry: () => void;
  children: ReactNode;
};

const TableWrapper = ({ error, handleRetry, children }: ITableWrapperProps) => {
  if (error) return <TableError retry={handleRetry} />;
  else return <>{children}</>;
};

export default TableWrapper;
