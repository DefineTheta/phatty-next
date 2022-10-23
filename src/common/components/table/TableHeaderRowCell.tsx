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
    if (!sorted) return <ChevronUpDownIcon className="w-16 h-16 text-text-20" />;

    if (sorted === 'asc') return <ChevronUpIcon className="w-16 h-16 text-text-20" />;
    else return <ChevronDownIcon className="w-16 h-16 text-text-20" />;
  };

  return (
    <div
      className={`py-12 flex flex-row flex-shrink-0 flex-grow items-center gap-x-8 text-sm font-bold text-text-200 cursor-pointer select-none transition-all duration-150 ease-in-out hover:text-text-300 ${className}`}
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
