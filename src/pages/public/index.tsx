import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddressList } from '@app-src/common/utils/format';
import { dislikeBundle, fetchPublicBundles, likeBundle } from '@app-src/store/bundle/bundleSlice';
import { selectPublicBundles } from '@app-src/store/bundle/selectors';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { MouseEvent, useCallback, useEffect } from 'react';

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

  const handleLikeBundle = useCallback(
    (bundleId: string, e: MouseEvent) => {
      e.stopPropagation();
      const promise = dispatch(likeBundle(bundleId));

      return () => promise.abort();
    },
    [dispatch]
  );

  const handleDislikeBundle = useCallback(
    (bundleId: string, e: MouseEvent) => {
      e.stopPropagation();
      const promise = dispatch(dislikeBundle(bundleId));

      return () => promise.abort();
    },
    [dispatch]
  );

  return (
    <div className="mt-36 flex w-full flex-col items-center">
      <Container>
        <Card>
          <TableHeaderRow>
            <TableHeaderRowCell className="basis-1/12">No.</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-2/12">Name</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-7/12">Wallets</TableHeaderRowCell>
            <TableHeaderRowCell className="basis-2/12">Actions</TableHeaderRowCell>
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
                <TableRowCell className="basis-7/12">
                  <span className="bg-purple-a cursor-pointer rounded-full text-md font-bold text-text-200 underline underline-offset-2">
                    {truncateAddressList(bundle.addresses)}
                  </span>
                </TableRowCell>
                <TableRowCell className="basis-2/12">
                  <div className="flex flex-row items-center gap-x-8">
                    <button
                      className="flex flex-row items-center gap-x-12 rounded-full border border-white/20 px-12 py-6 hover:border-white/60"
                      onClick={(e) => handleLikeBundle(bundle.id, e)}
                    >
                      <HandThumbUpIcon className="h-18 w-18" />
                      <span className="text-md">{bundle.likes}</span>
                    </button>
                    <button
                      className="flex flex-row items-center gap-x-12 rounded-full border border-white/20 px-12 py-6 hover:border-white/60"
                      onClick={(e) => handleDislikeBundle(bundle.id, e)}
                    >
                      <HandThumbDownIcon className="h-18 w-18" />
                      <span className="text-md">{bundle.dislikes}</span>
                    </button>
                  </div>
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
