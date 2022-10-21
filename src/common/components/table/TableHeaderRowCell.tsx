import { ReactNode } from 'react';

export type ITableHeaderRowCellProps = {
  className: string;
  children: ReactNode
}

const TableHeaderRowCell = ({ className, children }: ITableHeaderRowCellProps) => {
  return (
    <div className={`py-12 flex-shrink-0 flex-grow text-sm font-bold text-text-200 cursor-pointer select-none transition-all duration-150 ease-in-out hover:text-text-300 ${className}`}>
      {children}
    </div>
  )
}

export default TableHeaderRowCell;