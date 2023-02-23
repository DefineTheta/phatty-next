import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import { fetchBundles } from '@app-src/store/bundle/bundleSlice';
import { selectBundles } from '@app-src/store/bundle/selectors';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const BundlePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status: authStatus } = useSession();

  const bundleAddress = useAppSelector(useCallback(selectDisplayAddress(PortfolioEnum.BUNDLE), []));
  const bundles = useAppSelector(useCallback(selectBundles, []));

  useEffect(() => {
    if (!bundleAddress) return;

    router.push(`/bundle/${bundleAddress}/portfolio`);
  }, [bundleAddress]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      dispatch(fetchBundles());
    }
  }, [dispatch, authStatus]);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} currentChains={[]} />
      <div className="flex w-full flex-col items-center">
        <Container>
          <Card>
            <div className="flex flex-row justify-center">
              {authStatus === 'unauthenticated' ? (
                <span className="text-xl font-bold text-text-200">Connect your wallet</span>
              ) : (
                <pre>{JSON.stringify(bundles, null, 2)}</pre>
              )}
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default BundlePage;
