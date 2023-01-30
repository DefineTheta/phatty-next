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
import { clearPortfolio } from '@app-src/store/portfolio/portfolioSlice';
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
      },
      {
        name: 'PhameSac',
        addresses: [
          '0xa5bD947Bc9Bb9215c3290FF43f11F708b1d5B263',
          '0xB8bC81524338C84d9BBe6b07B50F4702a7Bb7230'
        ]
      },
      {
        name: 'PLSX',
        addresses: ['0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8']
      },
      {
        name: 'PulseChain',
        addresses: ['0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB']
      },
      {
        name: 'LiquidLoans',
        addresses: ['0x2e91728aF3a54aCDCeD7938fE9016aE2cc5948C9']
      },
      {
        name: 'Mintra',
        addresses: ['0xf55f1569b8c6b9c29c123f9375f9915529851427']
      },
      {
        name: 'Powercity',
        addresses: ['0x976746306D46830f528b5f042BF2e7204128b6A9']
      },
      {
        name: 'BNB/PLSPot',
        addresses: ['0x8b9c06ed27eefa2ac9fd7f0e2ab98add09da2a7e']
      },
      {
        name: 'Internet Money',
        addresses: ['0xceBA0659AeB8527B47E9B176237361dDEe352001']
      },
      {
        name: 'BankX',
        addresses: ['0xBDAD0dd0c0207094a341bD930a5562de3aCCE8Eb']
      },
      {
        name: 'PoorPleb',
        addresses: ['0x5bb8878472a5398944a674b1e217f5c925ceb546']
      },
      {
        name: 'PulseLN',
        addresses: ['0xa07a9a2A553bBBb8E3fC1b9cEeFF61865bD9276C']
      },
      {
        name: 'Texan',
        addresses: ['0xb13ea7b5932e1d4a060508c5bbde0fa25ee10418']
      },
      {
        name: 'uP Token',
        addresses: ['0xf1ce5d4fe82ae1e487cc0742c00e59236a19bb00']
      },
      {
        name: 'WinWin',
        addresses: ['0xcfb1e0c5645Fe132aF153CD37213F017eAaDD96B']
      },
      {
        name: 'PLSpeak',
        addresses: ['0x89E261160b5564e82B1a97470BB787e2F7b8F246']
      },
      {
        name: 'Dodeca',
        addresses: ['0x9bd477fdd738ee65e3d67d201f67f020ccb2dfdf']
      },
      {
        name: 'Hurricash',
        addresses: ['0x6e3257a21f0406578405e0c738c87a400332e0b4']
      },
      {
        name: 'decentralizeX',
        addresses: ['0x017b5900B4681B5C9Edd9BB5C08bCd6365e0dadE']
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

      if (currentBundleName !== data.name) dispatch(clearPortfolio(PortfolioEnum.PUBLIC));

      router.push(route);
    },
    [dispatch, router, publicBundleData, currentBundleName]
  );

  return (
    <div className="flex flex-col gap-y-24">
      <PublicHeader displayName="..." currentChains={[]} total="..." onRefreshData={() => {}} />
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
