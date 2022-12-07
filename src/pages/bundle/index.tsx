import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BundlePage = () => {
  const router = useRouter();
  const bundleAddress = useSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));

  useEffect(() => {
    if (!bundleAddress) return;

    router.push(`/bundle/${bundleAddress}/portfolio`);
  }, [bundleAddress]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} currentChains={[]} />
      <div className="flex w-full flex-col items-center">
        <Container>
          <Card>
            <div className="flex flex-row justify-center">
              <span className="text-xl font-bold text-text-200">Connect your wallet</span>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default BundlePage;
