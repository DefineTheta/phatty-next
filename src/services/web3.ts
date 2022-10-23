import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { hexABI } from './abi';

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
  SYN: '/img/tokens/syn.webp'
};

export const chainImages: Record<string, string> = {
  ETH: '/img/chains/eth.svg',
  BSC: '/img/chains/bsc.svg',
  TPLS: '/img/chains/tpls.svg'
};

const defillamaURL = 'https://coins.llama.fi/prices/current/';
const phiatPriceURL = 'https://phiat.exchange/px';

export const fetchPrices = async () => {
  try {
    const response = await fetch(
      `${defillamaURL}coingecko:ethereum,coingecko:hex,coingecko:hedron,coingecko:usd-coin,coingecko:tether,coingecko:binance-usd,coingecko:matic-network,coingecko:shiba-inu,coingecko:weth,coingecko:chainlink,coingecko:dai,coingecko:genesis-mana,coingecko:binancecoin,coingecko:fantom,coingecko:wise-token11,coingecko:wrapped-bitcoin,coingecko:staked-ether,coingecko:near,coingecko:apecoin,coingecko:wrapped-filecoin,coingecko:stp-network,coingecko:the-sandbox,coingecko:chiliz,coingecko:theta-token,coingecko:zilliqa,coingecko:gala,coingecko:amber,coingecko:gmt-token,coingecko:true-usd,coingecko:the-graph,coingecko:status,coingecko:aergo,coingecko:ethereum-name-service,coingecko:lido-dao,coingecko:bitdao,coingecko:vendetta-finance,coingecko:enjincoin,coingecko:dydx,coingecko:harmony,coingecko:marlin,coingecko:polymath,coingecko:stargate-finance,coingecko:havven,coingecko:omisego,coingecko:power-ledger,coingecko:sushi,coingecko:basic-attention-token,coingecko:1inch,coingecko:yearn-finance,coingecko:golem,coingecko:wbnb,coingecko:synapse-2`
    );
    const defiPriceData = (await response.json()) as any;

    const tplsPriceResponse = await fetch(phiatPriceURL);
    const tplsPriceData = await tplsPriceResponse.json();

    let prices: any = {};
    Object.values(defiPriceData.coins).forEach((item: any) => {
      prices[item.symbol] = item.price;
    });

    prices = { ...prices, ...tplsPriceData.chain_tpls };

    return prices as Record<string, number>;
  } catch (e) {
    console.error('Could not fetch live prices');
  }
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
