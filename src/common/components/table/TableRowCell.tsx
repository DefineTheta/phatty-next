import { ReactNode } from 'react';

export type ITableRowCell = {
  className: string;
  children?: ReactNode;
};

const TableRowCell = ({ className, children }: ITableRowCell) => {
  return (
    <div className={`flex-shrink-0 flex-grow py-12 text-md text-text-300 ${className}`}>
      {children}
    </div>
  );
};

export default TableRowCell;
