import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddressList } from '@app-src/common/utils/format';
import { fetchPublicBundles } from '@app-src/store/bundle/bundleSlice';
import { selectPublicBundles } from '@app-src/store/bundle/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const PublicBundlesListPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const bundles = useAppSelector(useCallback(selectPublicBundles, []));

  useEffect(() => {
    const promise = dispatch(fetchPublicBundles());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleBundleClick = useCallback(
    (bundleId: string) => {
      router.push(`/public/${bundleId}/portfolio`);
    },
    [router]
  );

  return (
    <div className="mt-36 flex w-full flex-col items-center">
      <Container>
        <Card>
          <TableHeaderRow>
            <TableHeaderRowCell className="basis-1/12">No.</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-2/12">Name</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-9/12">Wallets</TableHeaderRowCell>
          </TableHeaderRow>
          {bundles.map((bundle, index) => (
            <a
              className="cursor-pointer"
              key={bundle.id}
              onClick={() => handleBundleClick(bundle.id)}
            >
              <TableRow>
                <TableRowCell className="basis-1/12">{index + 1}</TableRowCell>
                <TableRowCell className="basis-2/12">{bundle.name}</TableRowCell>
                <TableRowCell className="basis-9/12">
                  <span className="bg-purple-a cursor-pointer rounded-full text-md font-bold text-text-200 underline underline-offset-2">
                    {truncateAddressList(bundle.addresses)}
                  </span>
                </TableRowCell>
              </TableRow>
            </a>
          ))}
        </Card>
      </Container>
    </div>
  );
};

export default PublicBundlesListPage;
