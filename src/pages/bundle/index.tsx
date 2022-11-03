import Card from '@app-src/common/components/layout/Card';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { selectBundleAddress } from '@app-src/store/bundles/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BundlePage = () => {
  const router = useRouter();
  const bundleAddress = useSelector(useCallback(selectBundleAddress, []));

  useEffect(() => {
    if (!bundleAddress) return;

    router.push(`/bundle/${bundleAddress}/portfolio`);
  }, [bundleAddress]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} />
      <div className="w-full flex flex-col items-center">
        <Card>
          <div className="flex flex-row justify-center">
            <span className="text-xl font-bold text-text-200">Connect your wallet</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BundlePage;