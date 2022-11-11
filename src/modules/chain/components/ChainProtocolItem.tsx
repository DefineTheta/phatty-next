import Image from 'next/image';

export type IChainProtocolItem = {
  protocolName: string;
  totalAmount: string;
  imgSrc: string;
  imgAlt: string;
  linkHref: string;
};

const ChainProtocolItem = ({
  protocolName,
  totalAmount,
  imgSrc,
  imgAlt,
  linkHref
}: IChainProtocolItem) => {
  return (
    <a
      href={linkHref}
      className="w-150 cursor-pointer rounded-lg bg-background-100 p-10 transition-colors duration-150 ease-in-out hover:bg-background-900 hover:backdrop-opacity-25"
    >
      <div className="flex flex-row items-center gap-x-10">
        <Image width="20px" height="20px" src={imgSrc} alt={imgAlt} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-text-100">{protocolName}</span>
          <span className="text-sm font-bold text-text-300">{totalAmount}</span>
        </div>
      </div>
    </a>
  );
};

export default ChainProtocolItem;
