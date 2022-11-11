import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

export type ITableHeaderRowCellProps = {
  className: string;
  children?: ReactNode;
  onClick?: () => void;
  sortable?: boolean;
  sorted?: 'asc' | 'desc';
};

const TableHeaderRowCell = ({
  className,
  children,
  onClick,
  sortable,
  sorted
}: ITableHeaderRowCellProps) => {
  const getChevron = () => {
    if (!sortable) return null;
    if (!sorted) return <ChevronUpDownIcon className="text-text-20 h-16 w-16" />;

    if (sorted === 'asc') return <ChevronUpIcon className="text-text-20 h-16 w-16" />;
    else return <ChevronDownIcon className="text-text-20 h-16 w-16" />;
  };

  return (
    <div
      className={`flex flex-shrink-0 flex-grow cursor-pointer select-none flex-row items-center gap-x-8 py-12 text-sm font-bold text-text-200 transition-all duration-150 ease-in-out hover:text-text-300 ${className}`}
      onClick={onClick}
    >
      <>
        {children}
        {getChevron()}
      </>
    </div>
  );
};

export default TableHeaderRowCell;
