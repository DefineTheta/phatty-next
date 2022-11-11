import { ReactNode } from 'react';

export type ITableHeaderRowProps = {
  children: ReactNode;
};

const TableHeaderRow = ({ children }: ITableHeaderRowProps) => {
  return <div className="flex flex-row rounded bg-background-100 px-16">{children}</div>;
};

export default TableHeaderRow;
