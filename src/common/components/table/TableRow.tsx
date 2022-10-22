import { ReactNode } from 'react';

export type ITableRowProps = {
  children: ReactNode;
};

const TableRow = ({ children }: ITableRowProps) => {
  return (
    <div className="transition-colors duration-100 border-t border-border-200 hover:bg-background-200">
      <div className="px-16 flex flex-row justify-between items-center">{children}</div>
    </div>
  );
};

export default TableRow;
