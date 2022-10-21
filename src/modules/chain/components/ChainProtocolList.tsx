import ChainProtocolItem from "./ChainProtocolItem";

export type IChainProtocolListProps = {
  currentAssetChain: string;
}

const ChainProtocolList = ({ currentAssetChain }: IChainProtocolListProps) => {
  const testData = [
    {
      protocolName: 'Wallet',
      totalAmount: '$1,234,567.89',
      imgSrc: '/img/icon/wallet.svg',
      imgAlt: 'Wallet',
      linkHref: '#wallet'
    },
    {
      protocolName: 'Wallet',
      totalAmount: '$1,234,567.89',
      imgSrc: '/img/icon/wallet.svg',
      imgAlt: 'Wallet',
      linkHref: '#wallet'
    },
    {
      protocolName: 'Wallet',
      totalAmount: '$1,234,567.89',
      imgSrc: '/img/icon/wallet.svg',
      imgAlt: 'Wallet',
      linkHref: '#wallet'
    }
  ]

  return (
    <div className="flex flex-row flex-wrap gap-x-10">
      {
        testData.map((protocol, index) => (
          <ChainProtocolItem key={index} protocolName={protocol.protocolName} totalAmount={protocol.totalAmount} imgSrc={protocol.imgSrc} imgAlt={protocol.imgAlt} linkHref={protocol.linkHref} />
        ))
      }
    </div>
  )
}

export default ChainProtocolList;