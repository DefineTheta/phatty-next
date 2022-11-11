import Image from 'next/image';

export type IChainSummaryItem = {
  imgSrc: string;
  imgAlt: string;
  chainDisplayName: string;
  chainTotal: string;
  chainPercentage: string;
  selected: boolean;
};

const ChainSummaryItem = ({
  imgSrc,
  imgAlt,
  chainDisplayName,
  chainTotal,
  chainPercentage,
  selected
}: IChainSummaryItem) => {
  return (
    <div
      className={`w-fit min-w-12 cursor-pointer text-text-100 transition-all duration-100 ease-in-out hover:text-text-900 hover:opacity-60 ${
        !selected && 'opacity-40'
      }`}
    >
      <div className="flex flex-row items-center gap-x-10">
        <Image src={imgSrc} width="32px" height="32px" alt={imgAlt} />
        <div className="flex flex-col items-start">
          <span className="text-sm">Assets on {chainDisplayName}</span>
          <div className="flex flex-row items-center gap-x-6">
            <span className="text-base font-bold">{chainTotal}</span>
            <span className="text-sm">{chainPercentage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainSummaryItem;
