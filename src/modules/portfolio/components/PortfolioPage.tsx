import Container from '@app-src/common/components/layout/Container';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import { Portfolio, PortfolioChain } from '../types/portfolio';
import HedronTableGroup from './hedron/HedronTableGroup';
import HexTableGroup from './hex/HexTableGroup';
import IcosaTableGroup from './icosa/IcosaTableGroup';
import PancakeTableGroup from './pancake/PancakeTableGroup';
import PhamousTableGroup from './phamous/PhamousTableGroup';
import PhiatTableGroup from './phiat/PhiatTableGroup';
import PulsexTableGroup from './pulsex/PulsexTableGroup';
import SushiTableGroup from './sushi/SushiTableGroup';
import UniV2TableGroup from './univ2/UniV2TableGroup';
import UniV3TableGroup from './univ3/UniV3TableGroup';
import WalletTableGroup from './wallet/WalletTableGroup';
import XenTableGroup from './xen/XenTableGroup';

type IPortfolioPageProps = {
  page: Portfolio;
  chains: PortfolioChain[];
};

const PortfolioPage = ({ page, chains }: IPortfolioPageProps) => {
  return (
    <div className="flex w-full justify-center">
      <Container>
        <div className="flex w-full flex-col items-center gap-y-30">
          <ChainSummaryCard page={page} currentChains={chains} />
          <WalletTableGroup page={page} currentChains={chains} />
          <HexTableGroup page={page} currentChains={chains} />
          <PhiatTableGroup page={page} currentChains={chains} />
          <PhamousTableGroup page={page} currentChains={chains} />
          <PulsexTableGroup page={page} currentChains={chains} />
          <PancakeTableGroup page={page} currentChains={chains} />
          <SushiTableGroup page={page} currentChains={chains} />
          <UniV2TableGroup page={page} currentChains={chains} />
          <UniV3TableGroup page={page} currentChains={chains} />
          <HedronTableGroup page={page} currentChains={chains} />
          <XenTableGroup page={page} currentChains={chains} />
          <IcosaTableGroup page={page} currentChains={chains} />
        </div>
      </Container>
    </div>
  );
};

export default PortfolioPage;
