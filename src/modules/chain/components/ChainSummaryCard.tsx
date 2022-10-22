import Card from '@app-src/common/components/layout/Card';
import ChainSummaryItem from '@app-src/modules/chain/components/ChainSummaryItem';
import ChainProtocolList from './ChainProtocolList';

const ChainSummaryCard = () => {
  const testData = [
    {
      imgSrc: '/img/tokens/eth.png',
      imgAlt: 'Ethereum logo',
      chainDisplayName: 'Ethereum'
    },
    {
      imgSrc: '/img/tokens/eth.png',
      imgAlt: 'Ethereum logo',
      chainDisplayName: 'Ethereum'
    },
    {
      imgSrc: '/img/tokens/eth.png',
      imgAlt: 'Ethereum logo',
      chainDisplayName: 'Ethereum'
    }
  ];

  return (
    <Card>
      <div className="flex flex-col gap-y-30">
        <div className="flex flex-row flex-wrap gap-y-18 gap-x-20">
          {testData.map((chain, index) => (
            <ChainSummaryItem
              key={index}
              imgSrc={chain.imgSrc}
              imgAlt={chain.imgAlt}
              chainDisplayNanme={chain.chainDisplayName}
            />
          ))}
        </div>
        <ChainProtocolList currentAssetChain="eth" />
      </div>
    </Card>
  );
};

export default ChainSummaryCard;
