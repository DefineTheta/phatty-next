import { ReactNode } from "react";

export type ITableRowProps = {
  children: ReactNode
}

const TableRow = ({ children }: ITableRowProps ) => {
  return (
    <div className='transition-colors ease-in-out duration-100 hover:bg-background-200 next-same-element:border next-same-element:border-t-border-200'>
      <div className="px-16 flex flex-row justify-between items-center">
        {children}
      </div>
    </div>
  )
}

export default TableRow;