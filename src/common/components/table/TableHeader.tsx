import Image from 'next/image';

export type ITableHeaderProps = {
  tableId?: string;
  tableLink?: string;
  tableName: string;
  totalValue: string;
  tablePrimaryImgSrc: string;
  tablePrimaryImgAlt: string;
  tableSecondaryImgSrc?: string;
  tableSecondaryImgAlt?: string;
}

const TableHeader = ({ tableId, tableLink, tableName, totalValue, tablePrimaryImgSrc, tablePrimaryImgAlt, tableSecondaryImgSrc, tableSecondaryImgAlt }: ITableHeaderProps) => {
  return (
    <div id="table-header" className='flex flex-row justify-between'>
      <div className='flex flex-row gap-x-14 items-center'>
        <div className='relative'>
          <Image width="20px" height="20px" src={tablePrimaryImgSrc} alt={tablePrimaryImgAlt} />
          {
            tableSecondaryImgSrc && (
              <Image className="absolute -top-6 -right-6 z-10" width="12px" height="12px" src={tableSecondaryImgSrc} alt={tableSecondaryImgAlt} />
            )
          }
        </div>
        {
          tableLink ? (
            <a className='no-underline text-lg text-text-800' href={tableLink} target="_blank" rel="noreferrer">
              {tableName}
            </a>
          ) : (
            <span className='text-lg font-bold text-text-300'>
              {tableName}
            </span>
          )
        }
      </div>
      <span className='text-base font-bold text-text-300 text-right'>
        {totalValue}
      </span>
    </div>
  )
}

export default TableHeader;