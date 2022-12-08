import { PriceResponse } from '@app-src/types/api';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { hexABI, phattyUIDataProviderABI } from './abi';

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

export const API_BASE_URL = process.env.API_BASE_URL;
export const API_PRICE_URL = `${API_BASE_URL}/price`;

type Web3ApiRouteOptions = {
  isPaginated: boolean;
};

const defaultWeb3ApiRouteOptions: Web3ApiRouteOptions = {
  isPaginated: false
};

export const withWeb3ApiRoute =
  (handler: NextApiHandler, options: Web3ApiRouteOptions = defaultWeb3ApiRouteOptions) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      res.setHeader('Cache-Control', 's-maxage=3600');
      const { address } = req.query;

      if (!address || typeof address === 'object') return res.status(400).end();

      const page: number = Number(req.query.page || 1);

      if (options.isPaginated && page < 1) return res.status(400).end();

      const priceResponse = await fetch(API_PRICE_URL);

      if (priceResponse.status !== 200) return res.status(500).end();

      const price: PriceResponse = await priceResponse.json();

      req.middleware = { address, price, page };

      await handler(req, res);
    } catch (err) {
      res
        .status(500)
        .send({ data: [], error: 'An error occured while trying to process the request' });
    }
  };

export type PhiatReserveResponse = PhiatReserveDataItem[];

export const lendingPoolProviderAddress = '0x7FBC7680D205379af17AdE85b92917A8252a6DEf';

export const tokenImages: Record<string, string> = {
  ETH: '/img/tokens/eth.png',
  BNB: '/img/tokens/bnb.png',
  WBNB: '/img/tokens/bnb.png',
  BSC: '/img/tokens/bnb.png',
  PLS: '/img/tokens/pls.svg',
  PHSAC: '/img/tokens/phsac.png',
  HEX: '/img/tokens/hex.svg',
  TPLS_HEX: '/img/tokens/hex.svg',
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
  MIM: '/img/tokens/mim.webp',
  UNI: '/img/tokens/uni.webp',
  AVAX: '/img/tokens/avax.webp',
  WAVAX: '/img/tokens/avax.webp',
  FRAX: '/img/tokens/frax.webp',
  AAVE: '/img/tokens/aave.webp',
  PHLP: '/img/tokens/phlp.svg',
  PHAME: '/img/tokens/phame.svg',
  LOAN: '/img/tokens/loan.svg',
  XEN: '/img/tokens/xen.png',
  MAXI: '/img/tokens/maxi.png',
  WMATIC: '/img/tokens/wmatic.webp',
  AMB: '/img/tokens/amb.png',
  MARS: '/img/tokens/mars.webp',
  WFTM: '/img/tokens/wftm.webp',
  BOO: '/img/tokens/boo.webp',
  SPIRIT: '/img/tokens/spirit.webp',
  TOMB: '/img/tokens/tomb.webp',
  TSHARE: '/img/tokens/tshare.webp',
  LQDR: '/img/tokens/lqdr.webp',
  SPELL: '/img/tokens/spell.webp',
  MAN: '/img/tokens/man.webp',
  BEETS: '/img/tokens/beets.webp'
};

const defiLlamaPriceQueryData = [
  { type: 'coingecko', symbol: 'ETH', id: 'ethereum' },
  { type: 'coingecko', symbol: 'CAKE', id: 'pancakeswap-token' },
  { type: 'coingecko', symbol: 'HEX', id: 'hex' },
  { type: 'coingecko', symbol: 'HDRN', id: 'hedron' },
  { type: 'coingecko', symbol: 'USDC', id: 'usd-coin' },
  { type: 'coingecko', symbol: 'USDT', id: 'tether' },
  { type: 'coingecko', symbol: 'BUSD', id: 'binance-usd' },
  { type: 'coingecko', symbol: 'MATIC', id: 'matic-network' },
  { type: 'coingecko', symbol: 'SHIB', id: 'shiba-inu' },
  { type: 'coingecko', symbol: 'WETH', id: 'weth' },
  { type: 'coingecko', symbol: 'LINK', id: 'chainlink' },
  { type: 'coingecko', symbol: 'DAI', id: 'dai' },
  { type: 'coingecko', symbol: 'MANA', id: 'genesis-mana' },
  { type: 'coingecko', symbol: 'BNB', id: 'binancecoin' },
  { type: 'coingecko', symbol: 'FTM', id: 'fantom' },
  { type: 'coingecko', symbol: 'WISE', id: 'wise-token11' },
  { type: 'coingecko', symbol: 'WBTC', id: 'wrapped-bitcoin' },
  { type: 'coingecko', symbol: 'STETH', id: 'staked-ether' },
  { type: 'coingecko', symbol: 'NEAR', id: 'near' },
  { type: 'coingecko', symbol: 'APE', id: 'apecoin' },
  { type: 'coingecko', symbol: 'WFIL', id: 'wrapped-filecoin' },
  { type: 'coingecko', symbol: 'STPT', id: 'stp-network' },
  { type: 'coingecko', symbol: 'SAND', id: 'the-sandbox' },
  { type: 'coingecko', symbol: 'CHZ', id: 'chiliz' },
  { type: 'coingecko', symbol: 'THETA', id: 'theta-token' },
  { type: 'coingecko', symbol: 'ZIL', id: 'zilliqa' },
  { type: 'coingecko', symbol: 'GALA', id: 'gala' },
  { type: 'coingecko', symbol: 'AMB', id: 'amber' },
  { type: 'coingecko', symbol: 'GMT', id: 'gmt-token' },
  { type: 'coingecko', symbol: 'TUSD', id: 'true-usd' },
  { type: 'coingecko', symbol: 'GRT', id: 'the-graph' },
  { type: 'coingecko', symbol: 'SNT', id: 'status' },
  { type: 'coingecko', symbol: 'AERGO', id: 'aergo' },
  { type: 'coingecko', symbol: 'ENS', id: 'ethereum-name-service' },
  { type: 'coingecko', symbol: 'LDO', id: 'lido-dao' },
  { type: 'coingecko', symbol: 'BIT', id: 'bitdao' },
  { type: 'coingecko', symbol: 'VEN', id: 'vendetta-finance' },
  { type: 'coingecko', symbol: 'ENJ', id: 'enjincoin' },
  { type: 'coingecko', symbol: 'DYDX', id: 'dydx' },
  { type: 'coingecko', symbol: 'ONE', id: 'harmony' },
  { type: 'coingecko', symbol: 'POND', id: 'marlin' },
  { type: 'coingecko', symbol: 'POLY', id: 'polymath' },
  { type: 'coingecko', symbol: 'STG', id: 'stargate-finance' },
  { type: 'coingecko', symbol: 'SNX', id: 'havven' },
  { type: 'coingecko', symbol: 'OMG', id: 'omisego' },
  { type: 'coingecko', symbol: 'POWR', id: 'power-ledger' },
  { type: 'coingecko', symbol: 'SUSHI', id: 'sushi' },
  { type: 'coingecko', symbol: 'BAT', id: 'basic-attention-token' },
  { type: 'coingecko', symbol: '1INCH', id: '1inch' },
  { type: 'coingecko', symbol: 'YFI', id: 'yearn-finance' },
  { type: 'coingecko', symbol: 'GLM', id: 'golem' },
  { type: 'coingecko', symbol: 'WBNB', id: 'wbnb' },
  { type: 'coingecko', symbol: 'SYN', id: 'synapse-2' },
  { type: 'coingecko', symbol: 'UNI', id: 'uniswap' },
  { type: 'coingecko', symbol: 'AVAX', id: 'avalanche-2' },
  { type: 'coingecko', symbol: 'WAVAX', id: 'wrapped-avax' },
  { type: 'coingecko', symbol: 'FRAX', id: 'frax' },
  { type: 'coingecko', symbol: 'AAVE', id: 'aave' },
  { type: 'coingecko', symbol: 'MAXI', id: 'maximus' },
  { type: 'coingecko', symbol: 'WMATIC', id: 'wmatic' },
  { type: 'coingecko', symbol: 'MARS', id: 'projectmars' },
  { type: 'coingecko', symbol: 'WFTM', id: 'wrapped-fantom' },
  { type: 'coingecko', symbol: 'BOO', id: 'spookyswap' },
  { type: 'coingecko', symbol: 'SPIRIT', id: 'spiritswap' },
  { type: 'coingecko', symbol: 'TOMB', id: 'tomb' },
  { type: 'coingecko', symbol: 'TSHARE', id: 'tomb-shares' },
  { type: 'coingecko', symbol: 'LQDR', id: 'liquiddriver' },
  { type: 'coingecko', symbol: 'SPELL', id: 'spell-token' },
  { type: 'coingecko', symbol: 'MAN', id: 'mangamon' },
  { type: 'coingecko', symbol: 'BEETS', id: 'beethoven-x' },
  { type: 'coingecko', symbol: 'MIM', id: 'magic-internet-money' },
  { type: 'coingecko', symbol: 'GLMR', id: 'moonbeam' },
  { type: 'coingecko', symbol: 'DOGE', id: 'dogecoin' },
  { type: 'coingecko', symbol: 'EVMOS', id: 'evmos' },
  { type: 'coingecko', symbol: 'OKT', id: 'oec-token' },
  { type: 'coingecko', symbol: 'ETHW', id: 'ethereum-pow-iou' },
  { type: 'coingecko', symbol: 'XEN', id: 'xen-crypto' },
  { type: 'bsc', symbol: 'XEN', id: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e' },
  { type: 'polygon', symbol: 'XEN', id: '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e' },
  { type: 'avax', symbol: 'XEN', id: '0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389' }
];

export const chainImages: Record<string, string> = {
  ETH: '/img/chains/eth.svg',
  BSC: '/img/chains/bsc.svg',
  TPLS: '/img/chains/tpls.svg',
  MATIC: '/img/chains/matic.svg',
  AVAX: '/img/chains/avax.svg',
  FTM: '/img/chains/ftm.svg',
  GLMR: '/img/chains/moonbeam.png',
  DOGE: '/img/chains/doge.svg',
  EVMOS: '/img/chains/evmos.webp',
  OKC: '/img/chains/okx.svg',
  ETHW: '/img/chains/ethw.png'
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

const defiLlamaPriceQueryDataLookup: Record<string, number> = {
  ETH: 0,
  CAKE: 1,
  HEX: 2,
  HDRN: 3,
  USDC: 4,
  USDT: 5,
  BUSD: 6,
  MATIC: 7,
  SHIB: 8,
  WETH: 9,
  LINK: 10,
  DAI: 11,
  MANA: 12,
  BNB: 13,
  FTM: 14,
  WISE: 15,
  WBTC: 16,
  STETH: 17,
  NEAR: 18,
  APE: 19,
  WFIL: 20,
  STPT: 21,
  SAND: 22,
  CHZ: 23,
  THETA: 24,
  ZIL: 25,
  GALA: 26,
  AMB: 27,
  GMT: 28,
  TUSD: 29,
  GRT: 30,
  SNT: 31,
  AERGO: 32,
  ENS: 33,
  LDO: 34,
  BIT: 35,
  VEN: 36,
  ENJ: 37,
  DYDX: 38,
  ONE: 39,
  POND: 40,
  POLY: 41,
  STG: 42,
  SNX: 43,
  OMG: 44,
  POWR: 45,
  SUSHI: 46,
  BAT: 47,
  '1INCH': 48,
  YFI: 49,
  GLM: 50,
  WBNB: 51,
  SYN: 52,
  UNI: 53,
  AVAX: 54,
  WAVAX: 55,
  FRAX: 56,
  AAVE: 57,
  MAXI: 58,
  WMATIC: 59,
  MARS: 60,
  WFTM: 61,
  BOO: 62,
  SPIRIT: 63,
  TOMB: 64,
  TSHARE: 65,
  LQDR: 66,
  SPELL: 67,
  MAN: 68,
  BEETS: 69,
  MIM: 70,
  GLMR: 71,
  DOGE: 72,
  EVMOS: 73,
  OKT: 74,
  ETHW: 75,
  XEN: 76,
  bXEN: 77,
  mXEN: 78,
  aXEN: 79
};

type DefiLlamaPriceItem = {
  decimals: number;
  symbol: string;
  price: number;
  timestamp: number;
  confidence: number;
};

type DefiLlamaPriceResponse = {
  coins: Record<string, DefiLlamaPriceItem>;
};

export const DEFI_LLAMA_URL = 'https://coins.llama.fi/prices/current';
const phiatPriceURL = 'https://phiat.exchange/px';

const getDefiCoinChain = (str: string) => {
  const parts = str.split(':');

  if (parts.length < 2) return '';

  switch (parts[0]) {
    case 'bsc':
      return 'BSC';
    case 'polygon':
      return 'MATIC';
    case 'avax':
      return 'AVAX';
    default:
      return '';
  }
};

export const fetchPrices = async () => {
  try {
    const coingeckoQueryParams = defiLlamaPriceQueryData.reduce(
      (str, priceData) => `${str},${priceData.type}:${priceData.id}`,
      ''
    );

    const response = await fetch(`${DEFI_LLAMA_URL}/${coingeckoQueryParams}`);
    const defiPriceData: DefiLlamaPriceResponse = (await response.json()) as any;

    const tplsPriceResponse = await fetch(phiatPriceURL);
    const tplsPriceData = await tplsPriceResponse.json();

    let prices: any = {};
    Object.entries(defiPriceData.coins).forEach(([key, value]) => {
      const chain = getDefiCoinChain(key);
      const defiQueryParam = defiLlamaPriceQueryData[defiLlamaPriceQueryDataLookup[value.symbol]];

      prices[`${defiQueryParam.symbol}${chain ? `_${chain}` : ''}`] = value.price;
    });

    const {
      HEX: TPLS_HEX,
      HDRN: TPLS_HDRN,
      XEN: TPLS_XEN,
      ...tplsTokenPrices
    } = tplsPriceData.chain_tpls;

    prices = { ...tplsTokenPrices, ...prices, TPLS_HEX, TPLS_HDRN, TPLS_XEN };

    return prices as Record<string, number>;
  } catch (e) {
    console.error('Could not fetch live prices');
  }
};

export const roundToPrecision = (amount: number, precision: number) => {
  return Math.round((amount + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
};

export const decryptAddress = (message: string, signature: string) => {
  return new Web3().eth.accounts.recover(message, signature);
};

const ethProviderURL = 'https://rpc.ankr.com/eth';
export const ethClient = new Web3();
ethClient.setProvider(new Web3.providers.HttpProvider(ethProviderURL));

const bscProviderURL = 'https://bsc-dataseed1.binance.org';
export const bscClient = new Web3();
bscClient.setProvider(new Web3.providers.HttpProvider(bscProviderURL));

const tplsProviderURL = 'https://rpc.v2b.testnet.pulsechain.com';
export const tplsClient = new Web3();
tplsClient.setProvider(new Web3.providers.HttpProvider(tplsProviderURL));

const MATIC_CONTRACT_URL = 'https://polygon-rpc.com';
export const maticClient = new Web3();
maticClient.setProvider(new Web3.providers.HttpProvider(MATIC_CONTRACT_URL));

const AVAX_CONTRACT_URL = 'https://api.avax.network/ext/bc/C/rpc';
export const avaxClient = new Web3();
avaxClient.setProvider(new Web3.providers.HttpProvider(AVAX_CONTRACT_URL));

const FTM_CONTRACT_URL = 'https://rpc.ankr.com/fantom';
export const ftmClient = new Web3();
ftmClient.setProvider(new Web3.providers.HttpProvider(FTM_CONTRACT_URL));

const GLMR_CONTRACT_URL = 'https://rpc.api.moonbeam.network';
export const glmrClient = new Web3(GLMR_CONTRACT_URL);

const EVMOS_CONTRACT_URL = 'https://evmos-rpc.gateway.pokt.network';
export const evmosClient = new Web3(EVMOS_CONTRACT_URL);

const DOGE_CONTRACT_URL = 'https://rpc01.dogechain.dog';
export const dogeClient = new Web3(DOGE_CONTRACT_URL);

const OKC_CONTRACT_URL = 'https://exchainrpc.okex.org';
export const okcClient = new Web3(OKC_CONTRACT_URL);

const ETHW_CONTRACT_URL = 'https://mainnet.ethereumpow.org';
export const ethwClient = new Web3(ETHW_CONTRACT_URL);

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
  phattyUIDataProviderABI,
  phattyUIDataProviderAddress
);
