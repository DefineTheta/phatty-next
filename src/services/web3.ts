import Web3 from 'web3';

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
