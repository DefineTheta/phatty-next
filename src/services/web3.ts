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
  LOAN: '/img/tokens/loan.webp',
  XEN: '/img/tokens/xen.webp',
  MAXI: '/img/tokens/maxi.jpg',
  WMATIC: '/img/tokens/wmatic.jpg',
  AMB: '/img/tokens/amb.png'
};

export const chainImages: Record<string, string> = {
  ETH: '/img/chains/eth.svg',
  BSC: '/img/chains/bsc.svg',
  TPLS: '/img/chains/tpls.svg',
  MATIC: '/img/chains/matic.svg',
  AVAX: '/img/chains/avax.svg'
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
      `${DEFI_LLAMA_URL}/coingecko:ethereum,coingecko:pancakeswap-token,coingecko:hex,coingecko:hedron,coingecko:usd-coin,coingecko:tether,coingecko:binance-usd,coingecko:matic-network,coingecko:shiba-inu,coingecko:weth,coingecko:chainlink,coingecko:dai,coingecko:genesis-mana,coingecko:binancecoin,coingecko:fantom,coingecko:wise-token11,coingecko:wrapped-bitcoin,coingecko:staked-ether,coingecko:near,coingecko:apecoin,coingecko:wrapped-filecoin,coingecko:stp-network,coingecko:the-sandbox,coingecko:chiliz,coingecko:theta-token,coingecko:zilliqa,coingecko:gala,coingecko:amber,coingecko:gmt-token,coingecko:true-usd,coingecko:the-graph,coingecko:status,coingecko:aergo,coingecko:ethereum-name-service,coingecko:lido-dao,coingecko:bitdao,coingecko:vendetta-finance,coingecko:enjincoin,coingecko:dydx,coingecko:harmony,coingecko:marlin,coingecko:polymath,coingecko:stargate-finance,coingecko:havven,coingecko:omisego,coingecko:power-ledger,coingecko:sushi,coingecko:basic-attention-token,coingecko:1inch,coingecko:yearn-finance,coingecko:golem,coingecko:wbnb,coingecko:synapse-2,coingecko:uniswap,coingecko:avalanche-2,coingecko:wrapped-avax,coingecko:frax,coingecko:aave,coingecko:xen-crypto,coingecko:maximus,coingecko:wmatic`
    );
    const defiPriceData = (await response.json()) as any;

    const tplsPriceResponse = await fetch(phiatPriceURL);
    const tplsPriceData = await tplsPriceResponse.json();

    let prices: any = {};
    Object.values(defiPriceData.coins).forEach((item: any) => {
      prices[item.symbol] = item.price;
    });

    const { HEX: TPLS_HEX, HDRN: TPLS_HDRN, ...tplsTokenPrices } = tplsPriceData.chain_tpls;

    prices = { ...prices, TPLS_HEX, TPLS_HDRN, ...tplsTokenPrices };

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

const ethProviderURL = 'https://mainnet.infura.io/v3/91173f1e92dc4107884d2b01a7156bd3';
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
