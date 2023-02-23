import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddressList } from '@app-src/common/utils/format';
import EditBundleModal from '@app-src/modules/modal/EditBundleModal';
import { createBundle, fetchBundles } from '@app-src/store/bundle/bundleSlice';
import { selectBundles } from '@app-src/store/bundle/selectors';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

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

  const handleBundleCreate = useCallback(() => {
    toast.promise(
      dispatch(createBundle())
        .unwrap()
        .then((bundle) => {
          setSelectedBundleId(bundle.id);
          setIsBundleEditModalVisible(true);
        }),
      {
        loading: <span className="text-md font-bold">Creating...</span>,
        success: <span className="text-md font-bold">Bundle created!</span>,
        error: <span className="text-md font-bold">Could not create bundle</span>
      }
    );
  }, []);

  const handleBundleEditClick = useCallback((bundleId: string, e: MouseEvent) => {
    e.stopPropagation();

    setSelectedBundleId(bundleId);
    setIsBundleEditModalVisible(true);
  }, []);

  const handleBundleEditClose = useCallback(() => {
    setIsBundleEditModalVisible(false);
  }, []);

  const handleBundleClick = useCallback(
    (bundleId: string) => {
      router.push(`/bundles/${bundleId}/portfolio`);
    },
    [router]
  );

  return (
    <>
      <div className="mt-36 flex w-full flex-col items-center">
        <Container>
          <Card>
            <TableHeaderRow>
              <TableHeaderRowCell className="basis-3/12">Name</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-8/12">Addresses</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-1/12"></TableHeaderRowCell>
            </TableHeaderRow>
            {bundles.map((bundle) => (
              <a
                className="cursor-pointer"
                key={bundle.id}
                onClick={() => handleBundleClick(bundle.id)}
              >
                <TableRow>
                  <TableRowCell className="basis-3/12">{bundle.name}</TableRowCell>
                  <TableRowCell className="basis-8/12 text-md font-bold text-text-200 underline underline-offset-2">
                    {truncateAddressList(bundle.addresses)}
                  </TableRowCell>
                  <TableRowCell className="basis-1/12">
                    <button
                      className="cursor-pointer"
                      onClick={(e) => handleBundleEditClick(bundle.id, e)}
                    >
                      <PencilIcon className="h-16 w-16" />
                    </button>
                  </TableRowCell>
                </TableRow>
              </a>
            ))}
            <button
              className="mt-8 flex cursor-pointer flex-row items-center gap-x-10 rounded-lg bg-purple-600 p-12 text-md font-semibold text-text-100"
              onClick={handleBundleCreate}
            >
              <PlusIcon className="h-20 w-20" />
              <span>New Bundle</span>
            </button>
          </Card>
        </Container>
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
