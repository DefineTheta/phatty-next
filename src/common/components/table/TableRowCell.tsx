import { ReactNode } from 'react';

export type ITableRowCell = {
  className: string;
  children?: ReactNode;
};

const TableRowCell = ({ className, children }: ITableRowCell) => {
  return (
    <div className={`py-12 flex-shrink-0 flex-grow text-sm text-text-300 ${className}`}>
      {children}
    </div>
  );
};

export default TableRowCell;
