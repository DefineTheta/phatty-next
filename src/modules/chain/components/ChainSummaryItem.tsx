import Image from 'next/image';

export type IChainSummaryItem = {
  imgSrc: string;
  imgAlt: string;
  chainDisplayNanme: string;
}

const ChainSummaryItem = ({ imgSrc, imgAlt, chainDisplayNanme }: IChainSummaryItem) => {
  return (
    <div className='w-fit min-w-12 text-text-100 cursor-pointer transition-all ease-in-out duration-100 hover:opacity-60 hover:text-text-900'>
      <div className='flex flex-row gap-x-10 items-center'>
        <Image src={imgSrc} width="32px" height="32px" alt={imgAlt} />
        <div className='flex flex-col items-start'>
          <span className='text-sm'>
            Assets on {chainDisplayNanme}
          </span>
          <div className='flex flex-row gap-x-6 items-center'>
            <span className='text-base font-bold'>
              {'$1,234,567.89'}
            </span>
            <span className='text-sm'>
              {'23.45%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChainSummaryItem;