import { ReactNode } from 'react';

export type ITableRowProps = {
  children: ReactNode[];
};

const TableRow = ({ children }: ITableRowProps) => {
  return (
    <div className="border-t border-border-200 transition-colors duration-100 hover:bg-background-200">
      <div className="flex flex-row items-center justify-between px-16">{children}</div>
    </div>
  );
};

export default TableRow;
