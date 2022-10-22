import { ReactNode } from 'react';

export type ITableHeaderRowProps = {
  children: ReactNode;
};

const TableHeaderRow = ({ children }: ITableHeaderRowProps) => {
  return <div className="px-16 flex flex-row bg-background-100 rounded">{children}</div>;
};

export default TableHeaderRow;
