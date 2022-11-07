import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { hexABI } from './abi';

export type PhiatReserveDataItem = {
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
  variableBorrowBps: string;
  stableBorrowBps: string;
  stableBorrowRateEnables: boolean;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  priceInPls: string;
  priceInUsd: number;
};

export type PhiatReserveResponse = PhiatReserveDataItem[];

const phattyUIDataProviderABI = [
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'contract IChainlinkAggregator',
        name: 'plsUsdPriceOracle',
        type: 'address'
      }
    ],
    name: 'getPhiatReserveData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'decimals',
            type: 'uint256'
          },
          {
            internalType: 'uint128',
            name: 'variableBorrowBps',
            type: 'uint128'
          },
          {
            internalType: 'uint128',
            name: 'stableBorrowBps',
            type: 'uint128'
          },
          {
            internalType: 'bool',
            name: 'stableBorrowRateEnabled',
            type: 'bool'
          },
          {
            internalType: 'address',
            name: 'aTokenAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'stableDebtTokenAddress',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'priceInPls',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'priceInUsd',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      }
    ],
    name: 'getPhiatStakingData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'stakingToken',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalStakedSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakingTokenPrecision',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'rewardDuration',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakeDuration',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawDuration',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
              }
            ],
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'rewardsPerToken',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPhiatStakingUserData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'walletBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawTimestamp',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawableBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'expirationTimestamp',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
              }
            ],
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'claimableRewards',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUserStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPhiatFeeDistribution',
        name: 'feeDistributor',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPhiatStakingUsersData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'walletBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'unstakedBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'withdrawableBalance',
            type: 'uint256'
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
              }
            ],
            internalType: 'struct IPhiatFeeDistribution.RewardAmount[]',
            name: 'claimableRewards',
            type: 'tuple[]'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUsersStakingData',
        name: 'data',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPhiatUserData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'aTokenBalance',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'usageAsCollateralEnabledOnUser',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'variableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'principalStableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stableBorrowRate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'stableBorrowLastUpdateTimestamp',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUserReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPhiatUsersData',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'underlyingAsset',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'aTokenBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'variableDebt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'principalStableDebt',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PhiatUsersReserveData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      }
    ],
    name: 'getPulsexPoolData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'token0',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'name0',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'name1',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol0',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol1',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'decimals0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'decimals1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      }
    ],
    name: 'getPulsexPools',
    outputs: [
      {
        internalType: 'address[]',
        name: 'pools',
        type: 'address[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'getPulsexUserData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance1',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexUserPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IPulseXFactory',
        name: 'pulseXFactory',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'startIdx_',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx_',
        type: 'uint256'
      },
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]'
      }
    ],
    name: 'getPulsexUsersData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'poolAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'poolBalance1',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance0',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'walletBalance1',
            type: 'uint256'
          }
        ],
        internalType: 'struct IPhattyUiDataProvider.PulsexUserPoolData[]',
        name: 'data',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

export const lendingPoolProviderAddress = '0xa17f0A2634aE032dC9a4dD74F9f7D0beb194f320';

export const tokenImages: Record<string, string> = {
  ETH: '/img/tokens/eth.png',
  BNB: '/img/tokens/bnb.png',
  WBNB: '/img/tokens/bnb.png',
  BSC: '/img/tokens/bnb.png',
  PLS: '/img/tokens/pls.svg',
  PHSAC: '/img/tokens/phsac.png',
  HEX: '/img/tokens/hex.svg',
  pulseX: '/img/tokens/pulsex.jpeg',
  HDRN: '/img/tokens/hdrn.png',
  HELGO: '/img/tokens/helgo.png',
  PHIAT: '/img/tokens/phsac.png',
  USDC: '/img/tokens/usdc.png',
  BUSD: '/img/tokens/busd.png',
  USDT: '/img/tokens/usdt.png',
  DAI: '/img/tokens/dai.png',
  SHIB: '/img/tokens/shib.png',
  LINK: '/img/tokens/link.png',
  TUSD: '/img/tokens/tusd.png',
  MANA: '/img/tokens/mana.png',
  MATIC: '/img/tokens/matic.png',
  WETH: '/img/tokens/weth.png',
  FTM: '/img/tokens/ftm.png',
  YFI: '/img/tokens/yfi.png',
  PLSX: '/img/tokens/pulsex.jpeg',
  STETH: '/img/tokens/steth.png',
  MINT: '/img/tokens/mint.png',
  NEAR: '/img/tokens/near.svg',
  APE: '/img/tokens/ape.svg',
  WFIL: '/img/tokens/wfil.svg',
  WISE: '/img/tokens/wise.webp',
  WBTC: '/img/tokens/wbtc.webp',
  STPT: '/img/tokens/stpt.webp',
  SAND: '/img/tokens/sand.webp',
  CHZ: '/img/tokens/chz.webp',
  GALA: '/img/tokens/gala.webp',
  GMT: '/img/tokens/gmt.webp',
  GRT: '/img/tokens/grt.webp',
  SNT: '/img/tokens/snt.webp',
  AERGO: '/img/tokens/aergo.webp',
  ENS: '/img/tokens/ens.webp',
  LDO: '/img/tokens/ldo.webp',
  BIT: '/img/tokens/bit.webp',
  VEN: '/img/tokens/ven.webp',
  ENJ: '/img/tokens/enj.webp',
  DYDX: '/img/tokens/dydx.webp',
  ONE: '/img/tokens/one.webp',
  POND: '/img/tokens/pond.webp',
  POLY: '/img/tokens/poly.webp',
  STG: '/img/tokens/stg.webp',
  SNX: '/img/tokens/snx.webp',
  OMG: '/img/tokens/omg.jpg',
  POWR: '/img/tokens/powr.webp',
  SUSHI: '/img/tokens/sushi.webp',
  BAT: '/img/tokens/bat.webp',
  '1INCH': '/img/tokens/1inch.webp',
  GLM: '/img/tokens/glm.webp',
  SYN: '/img/tokens/syn.webp',
  BTT: '/img/tokens/btt.webp',
  USDD: '/img/tokens/usdd.jpg',
  MIM: '/img/tokens/mim.webp'
};

export const chainImages: Record<string, string> = {
  ETH: '/img/chains/eth.svg',
  BSC: '/img/chains/bsc.svg',
  TPLS: '/img/chains/tpls.svg'
};

export const phiatTokensLookupMap = {
  '0x189246E1451757938b4C43c5309e54f5587C6DCC': {
    symbol: 'phPLS',
    address: '0x189246E1451757938b4C43c5309e54f5587C6DCC'
  },
  '0xc70Cbbadc81b0D39A5E8a5D4C565f6a64896D6D3': {
    symbol: 'phPHIAT',
    address: '0xc70Cbbadc81b0D39A5E8a5D4C565f6a64896D6D3'
  },
  '0xC5106910120cedC9b213fb29D0f03F760702599b': {
    symbol: 'phHEX',
    address: '0xC5106910120cedC9b213fb29D0f03F760702599b'
  },
  '0x74a2B18310E75697Abb484F6b47CFe51FE6d714A': {
    symbol: 'phPLSX',
    address: '0x74a2B18310E75697Abb484F6b47CFe51FE6d714A'
  },
  '0xb729391DF6a6cbeB0Fe14c0f4b45355b4942CF84': {
    symbol: 'phHDRN',
    address: '0xb729391DF6a6cbeB0Fe14c0f4b45355b4942CF84'
  },
  '0x77AD698773699eFBA06d6b477B5eF5Ab86170d5e': {
    symbol: 'phHELGO',
    address: '0x77AD698773699eFBA06d6b477B5eF5Ab86170d5e'
  },
  '0x0D14F7b11fCBa90E66E7b26F21cf875Ddc83fF39': {
    symbol: 'phUSDC',
    address: '0x0D14F7b11fCBa90E66E7b26F21cf875Ddc83fF39'
  }
};

export const DEFI_LLAMA_URL = 'https://coins.llama.fi/prices/current';
const phiatPriceURL = 'https://phiat.exchange/px';

export const fetchPrices = async () => {
  try {
    const response = await fetch(
      `${DEFI_LLAMA_URL}/coingecko:ethereum,coingecko:pancakeswap-token,coingecko:hex,coingecko:hedron,coingecko:usd-coin,coingecko:tether,coingecko:binance-usd,coingecko:matic-network,coingecko:shiba-inu,coingecko:weth,coingecko:chainlink,coingecko:dai,coingecko:genesis-mana,coingecko:binancecoin,coingecko:fantom,coingecko:wise-token11,coingecko:wrapped-bitcoin,coingecko:staked-ether,coingecko:near,coingecko:apecoin,coingecko:wrapped-filecoin,coingecko:stp-network,coingecko:the-sandbox,coingecko:chiliz,coingecko:theta-token,coingecko:zilliqa,coingecko:gala,coingecko:amber,coingecko:gmt-token,coingecko:true-usd,coingecko:the-graph,coingecko:status,coingecko:aergo,coingecko:ethereum-name-service,coingecko:lido-dao,coingecko:bitdao,coingecko:vendetta-finance,coingecko:enjincoin,coingecko:dydx,coingecko:harmony,coingecko:marlin,coingecko:polymath,coingecko:stargate-finance,coingecko:havven,coingecko:omisego,coingecko:power-ledger,coingecko:sushi,coingecko:basic-attention-token,coingecko:1inch,coingecko:yearn-finance,coingecko:golem,coingecko:wbnb,coingecko:synapse-2`
    );
    const defiPriceData = (await response.json()) as any;

    const tplsPriceResponse = await fetch(phiatPriceURL);
    const tplsPriceData = await tplsPriceResponse.json();

    let prices: any = {};
    Object.values(defiPriceData.coins).forEach((item: any) => {
      prices[item.symbol] = item.price;
    });

    const { HEX: TPLS_HEX, ...tplsTokenPrices } = tplsPriceData.chain_tpls;

    prices = { ...prices, TPLS_HEX, ...tplsTokenPrices };

    return prices as Record<string, number>;
  } catch (e) {
    console.error('Could not fetch live prices');
  }
};

export const decryptAddress = (message: string, signature: string) => {
  return new Web3().eth.accounts.recover(message, signature);
};

const ethProviderURL = 'https://mainnet.infura.io/v3/91173f1e92dc4107884d2b01a7156bd3';
export const ethClient = new Web3();
ethClient.setProvider(new Web3.providers.HttpProvider(ethProviderURL));

const bscProviderURL = 'https://bsc-dataseed1.binance.org';
export const bscClient = new Web3();
bscClient.setProvider(new Web3.providers.HttpProvider(bscProviderURL));

const tplsProviderURL = 'https://rpc.v2b.testnet.pulsechain.com';
export const tplsClient = new Web3();
tplsClient.setProvider(new Web3.providers.HttpProvider(tplsProviderURL));

export const hexETHContract = new ethClient.eth.Contract(
  hexABI as AbiItem[],
  '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'
);
export const hexPLSContract = new tplsClient.eth.Contract(
  hexABI as AbiItem[],
  '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39'
);

const phattyUIDataProviderAddress = '0x050faCf199CE9bF0E982619880225C55c90b2536';
export const phiatProviderContract = new tplsClient.eth.Contract(
  phattyUIDataProviderABI as AbiItem[],
  phattyUIDataProviderAddress
);
