import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import TableHeaderRow from '@app-src/common/components/table/TableHeaderRow';
import TableHeaderRowCell from '@app-src/common/components/table/TableHeaderRowCell';
import TableRow from '@app-src/common/components/table/TableRow';
import TableRowCell from '@app-src/common/components/table/TableRowCell';
import { truncateAddress } from '@app-src/common/utils/format';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { PublicBundleName } from '@app-src/modules/portfolio/types/portfolio';
import Link from 'next/link';
import { useMemo } from 'react';

const BundlePublicPage = () => {
  const publicBundleAddresses = useMemo(
    () => [
      [
        '0x431e81e5dfb5a24541b5ff8762bdef3f32f96354',
        '0xeec0591c07000e41e88efd153801c3fc0a11f7f4',
        '0x3ddfa8ec3052539b6c9549f12cea2c295cff5296'
      ]
    ],
    []
  );

  const publicBundles = useMemo(
    () =>
      publicBundleAddresses.map((addresses, index) => ({
        addresses,
        displayName: PublicBundleName[index],
        walletDisplayName: addresses.reduce(
          (name, address, index) => `${index !== 0 ? `${name} |` : ''} ${truncateAddress(address)}`,
          ''
        ),
        href: `/bundle/public/${index}`
      })),
    [publicBundleAddresses]
  );

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={''} currentChains={[]} />
      <div className="flex w-full flex-col items-center">
        <Container>
          <Card>
            <TableHeaderRow>
              <TableHeaderRowCell className="basis-1/12">No.</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-2/12">Name</TableHeaderRowCell>
              <TableHeaderRowCell className="basis-9/12">Wallets</TableHeaderRowCell>
            </TableHeaderRow>
            {publicBundles.map((bundle, index) => (
              <TableRow key={index}>
                <TableRowCell className="basis-1/12">{index + 1}</TableRowCell>
                <TableRowCell className="basis-2/12">{bundle.displayName}</TableRowCell>
                <TableRowCell className="basis-9/12">
                  <Link href={bundle.href}>
                    <a className="bg-purple-a cursor-pointer rounded-full text-md font-bold text-text-200 underline underline-offset-2">
                      {bundle.walletDisplayName}
                    </a>
                  </Link>
                </TableRowCell>
              </TableRow>
            ))}
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default BundlePublicPage;
