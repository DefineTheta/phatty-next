import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddressList } from '@app-src/common/utils/format';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import EditBundleModal from '@app-src/modules/modal/EditBundleModal';
import { fetchBundles } from '@app-src/store/bundle/bundleSlice';
import { selectBundles } from '@app-src/store/bundle/selectors';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const BundlesListPage = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const dispatch = useAppDispatch();

  const [selectedBundleId, setSelectedBundleId] = useState('');
  const [isBundleEditModalVisible, setIsBundleEditModalVisible] = useState(false);

  useEffect(() => {
    if (authStatus === 'authenticated') dispatch(fetchBundles());
  }, [dispatch, authStatus]);

  if (authStatus === 'unauthenticated') {
    router.push('/bundles');
  }

  const bundles = useAppSelector(useCallback(selectBundles, []));

  const handleBundleEditClick = useCallback((bundleId: string) => {
    console.log(bundleId);
    setSelectedBundleId(bundleId);
    setIsBundleEditModalVisible(true);
  }, []);

  const handleBundleEditClose = useCallback(() => {
    setIsBundleEditModalVisible(false);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-24">
        <BundleHeader address="" currentChains={[]} />
        <div className="flex w-full flex-col items-center">
          <Container>
            <Card>
              <TableHeaderRow>
                <TableHeaderRowCell className="basis-3/12">Name</TableHeaderRowCell>
                <TableHeaderRowCell className="basis-8/12">Addresses</TableHeaderRowCell>
                <TableHeaderRowCell className="basis-1/12"></TableHeaderRowCell>
              </TableHeaderRow>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableRowCell className="basis-3/12">{bundle.name}</TableRowCell>
                  <TableRowCell className="basis-8/12 text-md font-bold text-text-200 underline underline-offset-2">
                    {truncateAddressList(bundle.addresses)}
                  </TableRowCell>
                  <TableRowCell className="basis-1/12">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleBundleEditClick(bundle.id)}
                    >
                      <PencilIcon className="h-16 w-16" />
                    </button>
                  </TableRowCell>
                </TableRow>
              ))}
            </Card>
          </Container>
        </div>
      </div>
      {isBundleEditModalVisible && (
        <EditBundleModal
          isVisible={isBundleEditModalVisible}
          bundleId={selectedBundleId}
          handleClose={handleBundleEditClose}
        />
      )}
    </>
  );
};

export default BundlesListPage;
