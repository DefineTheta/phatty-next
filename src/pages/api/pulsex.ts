import {
  lendingPoolProviderAddress,
  phiatProviderContract,
  PhiatReserveDataItem,
  PhiatReserveResponse,
  tokenImages,
  tplsClient,
  withWeb3ApiRoute
} from '@app-src/services/web3';
import { PulsexResponse, PulsexTokenItem } from '@app-src/types/api';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

const pulsexLiquidityPoolABI = [
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'Burn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' }
    ],
    name: 'Mint',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' }
    ],
    name: 'Swap',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' }
    ],
    name: 'Sync',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'burn',
    outputs: [
      { internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_token0', type: 'address' },
      { internalType: 'address', name: '_token1', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' }
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const plsUsdPriceOracle = '0x2b8a4e53D0d46B91fb581a99893A9791F054b74e';

const hex_usdc_LPadd = '0x330C063Ad9f681477B0f7A36AA3176Ff3cE0bBb4';
const pls_usdc_LPadd = '0x2c4B07cFCf515c31F3FfC872a5933D637Cdce9BA';
const plsx_hex_LPadd = '0x09cA062DFf7272Ddd97379bd225239dE2834719F';
const plsx_usdc_LPadd = '0xed3E01E04861b295Fc98fff9cDee8Ff4Cd05A95F';
const plsx_hdrn_LPadd = '0xea1605296C29cB19525Ae073a74df7c4776851D5';
const hdrn_pls_LPadd = '0xaF581876E1F1Ff668A19F6C85440A9Fd033338f6';
const phiat_usdc_LPadd = '0xD3Cf2FF06be3A84a80591c59dA0485D529Fc9D7c';
const hex_hdrn_LPadd = '0x5776Db844787F83A3465B6f39cee0483C8F52Fd0';
const plsx_phiat_LPadd = '0x19C62B0C5A860Fbc5Ce71959EAB9BDec63d7ea1C';
const phsac_pls_LPadd = '0x110811F4B70070d2DCA206F5EF5FE68CF8CFF62E';
const phsac_usdc_LPadd = '0x8888D11D32827a5AdEaB087bdB8aC532dc74bd22';
const pls_phiat_LPadd = '0x49d9Fe2379b5325A6FDeFCe0f6bf7c2F45165D37';

const liquidityPoolContracts = [
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], hex_usdc_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], pls_usdc_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], plsx_hex_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], plsx_usdc_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], plsx_hdrn_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], hdrn_pls_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], phiat_usdc_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], hex_hdrn_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], plsx_phiat_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], phsac_pls_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], phsac_usdc_LPadd),
  new tplsClient.eth.Contract(pulsexLiquidityPoolABI as AbiItem[], pls_phiat_LPadd)
];

type LiquidityPoolReserve = {
  _reserve0: number;
  _reserve1: number;
  blockTimestampLast: string;
};

const calculateLiquidityPool = async (
  contract: Contract,
  address: string,
  phiatReserveLookupMap: Record<string, PhiatReserveDataItem>
) => {
  const balancePromise = contract.methods.balanceOf(address).call();
  const supplyPromise = contract.methods.totalSupply().call();
  const reservesPromise = contract.methods.getReserves().call();
  const tokenOnePromise = contract.methods.token0().call();
  const tokenTwoPromise = contract.methods.token1().call();

  let [balance, supply, reserves, tokenOneAddress, tokenTwoAddress] = await Promise.all<
    [number, number, LiquidityPoolReserve, string, string]
  >([balancePromise, supplyPromise, reservesPromise, tokenOnePromise, tokenTwoPromise]);

  balance = Number(balance);
  supply = Number(supply);

  const ratio = balance / supply;

  const tokenOneReserve = phiatReserveLookupMap[tokenOneAddress];
  const tokenTwoReserve = phiatReserveLookupMap[tokenTwoAddress];

  const tokeOneBalance = (reserves._reserve0 / 10 ** tokenOneReserve.decimals) * ratio;
  const tokenOnePrice = tokenOneReserve.priceInUsd;
  const tokenOneValue = tokeOneBalance * tokenOnePrice;
  const tokeTwoBalance = (reserves._reserve1 / 10 ** tokenTwoReserve.decimals) * ratio;
  const tokenTwoPrice = tokenTwoReserve.priceInUsd;
  const tokenTwoValue = tokeTwoBalance * tokenTwoPrice;

  const value = tokenOneValue + tokenTwoValue;

  const resObj = {
    tokenOne: {
      address: tokenOneAddress,
      balance: tokeOneBalance,
      value: tokeOneBalance * tokenOneReserve.priceInUsd,
      symbol: tokenOneReserve.symbol,
      image: tokenImages[tokenOneReserve.symbol],
      price: tokenOnePrice
    },
    tokenTwo: {
      address: tokenTwoAddress,
      balance: tokeTwoBalance,
      value: tokenTwoValue,
      symbol: tokenTwoReserve.symbol,
      image: tokenImages[tokenTwoReserve.symbol],
      price: tokenTwoPrice
    },
    usdValue: value,
    ratio
  } as PulsexTokenItem;

  return resObj;
};

export default withWeb3ApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PulsexResponse>
) {
  const { address, price } = req.middleware;

  const phiatReserveData: PhiatReserveResponse = await phiatProviderContract.methods
    .getPhiatReserveData(lendingPoolProviderAddress, plsUsdPriceOracle)
    .call();

  const newPhiatReserveData = [
    ...phiatReserveData,
    {
      underlyingAsset: '0x609BFD40359B3656858D83dc4c4E40D4fD34737F',
      symbol: 'PHSAC',
      decimals: 18,
      priceInUsd: price['PHSAC'] * 10 ** 18
    } as any as PhiatReserveDataItem
  ];

  const phiatReserveLookupMap: Record<string, PhiatReserveDataItem> = {};

  for (let i = 0; i < newPhiatReserveData.length; i++) {
    const data = { ...newPhiatReserveData[i] };
    data.decimals = Number(data.decimals);
    data.priceInUsd = Number(data.priceInUsd) / 10 ** 18;
    phiatReserveLookupMap[data.underlyingAsset] = data;
  }

  const liquidityPoolPromises: Promise<PulsexTokenItem>[] = [];

  liquidityPoolContracts.forEach((contract) => {
    liquidityPoolPromises.push(
      calculateLiquidityPool(contract, address as string, phiatReserveLookupMap)
    );
  });

  const liquidityPoolData = await Promise.all(liquidityPoolPromises);

  let totalValue = 0;
  const filteredLiquidityPoolData: PulsexTokenItem[] = [];

  for (let i = 0; i < liquidityPoolData.length; i++) {
    if (liquidityPoolData[i].usdValue > 0) {
      totalValue += liquidityPoolData[i].usdValue;
      filteredLiquidityPoolData.push(liquidityPoolData[i]);
    }
  }

  const resObj = {
    data: {
      LIQUIDITY_POOL: {
        data: filteredLiquidityPoolData,
        totalValue
      }
    }
  };

  res.status(200).json(resObj);
});
