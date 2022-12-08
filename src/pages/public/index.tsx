import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { truncateAddress } from '@app-src/common/utils/format';
import { PortfolioEnum } from '@app-src/modules/portfolio/types/portfolio';
import PublicHeader from '@app-src/modules/public/components/PublicHeader';
import {
  setAddresses,
  setDisplayAddress,
  setHasFetched
} from '@app-src/store/portfolio/portfolioSlice';
import { selectDisplayAddress } from '@app-src/store/portfolio/selectors';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

const BundlePublicPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const publicBundleData = useMemo(
    () => [
      {
        name: 'Dummy Bundle',
        addresses: [
          '0x431e81e5dfb5a24541b5ff8762bdef3f32f96354',
          '0xeec0591c07000e41e88efd153801c3fc0a11f7f4',
          '0x3ddfa8ec3052539b6c9549f12cea2c295cff5296'
        ]
      },
      {
        name: 'GodWhale',
        addresses: [
          '0xAF10cC6C50dEFFF901B535691550D7AF208939c5',
          '0x2BDE3b9C0129be4689E245Ba689b9b0Ae4AC666D',
          '0xf1Bd8E36a0e48650bdB28056277B05e851EBbAe8',
          '0x828FD91d3e3a9FFa6305e78B9aE2Cfbc5B5D9f6B',
          '0x1706D193862DA7f8C746aae63d514Df93Dfa5dbf',
          '0xdDf744374B46Aa980ddcE4a5AA216478bf925cD1',
          '0x2fD56159F4C8664a1de5c75E430338CFa58cd5b9',
          '0x807dc01d44407D3EfA0171F6De39076a27F20338',
          '0x3930F94249A66535bc0F177Bc567152320dd7e6c',
          '0x41b20fBb9E38AbeAef31Fa45a9B760D251180A5b',
          '0xF5D7B1B20288B9052E9CbdBf877A19077EdB34d8'
        ]
      },
      {
        name: 'PhiatSac',
        addresses: [
          '0xab502a6fb9b9984341e77716b36484ac13dddc62',
          '0xb7be6284b4f8b808f5204c03dc9b5419840ad73d'
        ]
      }
    ],
    []
  );

  const publicBundles = useMemo(
    () =>
      publicBundleData.map((data, index) => ({
        displayName: data.name,
        addresses: data.addresses,
        walletDisplayName: data.addresses.reduce(
          (name, address, index) => `${index !== 0 ? `${name} |` : ''} ${truncateAddress(address)}`,
          ''
        ),
        href: `/bundle/public/${index}`
      })),
    [publicBundleData]
  );

  const currentBundleName = useAppSelector(
    useCallback(selectDisplayAddress(PortfolioEnum.PUBLIC), [])
  );

  const handleBundleClick = useCallback(
    (index: number) => {
      const data = publicBundleData[index];
      const route = `/public/${index}`;

      dispatch(setAddresses({ addresses: data.addresses, type: PortfolioEnum.PUBLIC }));
      dispatch(setDisplayAddress({ address: data.name, type: PortfolioEnum.PUBLIC }));

      if (currentBundleName !== data.name)
        dispatch(setHasFetched({ hasFetched: false, type: PortfolioEnum.PUBLIC }));

      router.push(route);
    },
    [dispatch, router, publicBundleData, currentBundleName]
  );

  return (
    <div className="flex flex-col gap-y-24">
      <PublicHeader displayName="..." total="..." onRefreshData={() => {}} />
      <div className="flex w-full flex-col items-center">
        <Container>
          <Card>
            <TableHeaderRow>
              <TableHeaderRowCell className="basis-1/12">No.</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-2/12">Name</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-9/12">Wallets</TableHeaderRowCell>
            </TableHeaderRow>
            {publicBundles.map((bundle, index) => (
              <button
                className="w-full cursor-pointer"
                key={index}
                onClick={() => handleBundleClick(index)}
              >
                <TableRow>
                  <TableRowCell className="basis-1/12">{index + 1}</TableRowCell>
                  <TableRowCell className="basis-2/12">{bundle.displayName}</TableRowCell>
                  <TableRowCell className="basis-9/12">
                    <span className="bg-purple-a cursor-pointer rounded-full text-md font-bold text-text-200 underline underline-offset-2">
                      {bundle.walletDisplayName}
                    </span>
                  </TableRowCell>
                </TableRow>
              </button>
            ))}
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default BundlePublicPage;
