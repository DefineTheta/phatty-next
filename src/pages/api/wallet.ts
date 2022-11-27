import {
  avaxClient,
  bscClient,
  chainImages,
  ethClient,
  fetchPrices,
  maticClient,
  tokenImages,
  tplsClient
} from '@app-src/services/web3';
import { WalletResponse, WalletTokenItem } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const walletABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
] as AbiItem[];

const ethTokens = [
  { name: 'ETH', address: '0x' },
  { name: 'HEX', address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' },
  { name: 'HDRN', address: '0x3819f64f282bf135d62168C1e513280dAF905e06' },
  { name: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { name: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { name: 'BUSD', address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53' },
  { name: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' },
  { name: 'SHIB', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' },
  { name: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { name: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
  { name: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
  { name: 'MANA', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942' },
  { name: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' },
  { name: 'FTM', address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870' },
  { name: 'WISE', address: '0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6' },
  { name: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  { name: 'STETH', address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' },
  { name: 'NEAR', address: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4' },
  { name: 'APE', address: '0x4d224452801aced8b2f0aebe155379bb5d594381' },
  { name: 'WFIL', address: '0x6e1A19F235bE7ED8E3369eF73b196C07257494DE' },
  { name: 'STPT', address: '0xDe7D85157d9714EADf595045CC12Ca4A5f3E2aDb' },
  { name: 'SAND', address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0' },
  { name: 'CHZ', address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF' },
  { name: 'THETA', address: '0x3883f5e181fccaF8410FA61e12b59BAd963fb645' },
  { name: 'ZIL', address: '0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27' },
  { name: 'GALA', address: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA' },
  { name: 'AMB', address: '0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE' },
  { name: 'GMT', address: '0xe3c408BD53c31C085a1746AF401A4042954ff740' },
  { name: 'TUSD', address: '0x0000000000085d4780B73119b644AE5ecd22b376' },
  { name: 'GRT', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7' },
  { name: 'SNT', address: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E' },
  { name: 'AERGO', address: '0x91Af0fBB28ABA7E31403Cb457106Ce79397FD4E6' },
  { name: 'ENS', address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72' },
  { name: 'LDO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32' },
  { name: 'BIT', address: '0x1A4b46696b2bB4794Eb3D4c26f1c55F9170fa4C5' },
  { name: 'VEN', address: '0xD850942eF8811f2A866692A623011bDE52a462C1' },
  { name: 'ENJ', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c' },
  { name: 'DYDX', address: '0x92D6C1e31e14520e676a687F0a93788B716BEff5' },
  // { name: 'LRC', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD' },
  { name: 'ONE', address: '0x799a4202c12ca952cB311598a024C80eD371a41e' },
  { name: 'POND', address: '0x57B946008913B82E4dF85f501cbAeD910e58D26C' },
  { name: 'POLY', address: '0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC' },
  { name: 'STG', address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6' },
  { name: 'SNX', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' },
  { name: 'OMG', address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07' },
  { name: 'POWR', address: '0x595832F8FC6BF59c85C527fEC3740A1b7a361269' },
  { name: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2' },
  { name: 'BAT', address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF' },
  { name: '1INCH', address: '0x111111111117dC0aa78b770fA6A738034120C302' },
  { name: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e' },
  { name: 'GLM', address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429' },
  { name: 'SYN', address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429' }
];

const bscTokens = [
  { name: 'BNB', address: '0x' },
  { name: 'ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' },
  { name: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955' },
  { name: 'WBNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' },
  { name: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' },
  { name: 'BUSD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
  { name: 'SHIB', address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D' },
  { name: 'DAI', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3' },
  { name: 'LINK', address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD' }
];

const tplsTokens = [
  { name: 'PLS', address: '0x' },
  { name: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { name: 'PLSX', address: '0x07895912f3ab0e33ab3a4cefbdf7a3e121eb9942' },
  { name: 'HEX', address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39' },
  { name: 'INC', address: '0x083f559993227395009596f77496fdc48e84c69a' },
  { name: 'PHIAT', address: '0x240196d9f3bad74e067a11093026b8bc2613b689' },
  { name: 'HDRN', address: '0x3819f64f282bf135d62168c1e513280daf905e06' },
  { name: 'HELGO', address: '0x0567ca0de35606e9c260cc2358404b11de21db44' },
  { name: 'MINT', address: '0x079d5348d11fc5636f2f569641aa32363888b568' },
  { name: 'PHSAC', address: '0x609BFD40359B3656858D83dc4c4E40D4fD34737F' },
  { name: 'PHAME', address: '0xf120Dc7395FE6dDe218d72C9F5188FE280F6c458' }
];

const maticTokens = [
  { name: 'MATIC', address: '0x' },
  { name: 'WETH', address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' },
  { name: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
  { name: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
  { name: 'BUSD', address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39' },
  { name: 'BUSD', address: '0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7' },
  { name: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
  { name: 'UNI', address: '0xb33eaad8d922b1083446dc23f610c2567fb5180f' },
  { name: 'AVAX', address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b' },
  { name: 'WBTC', address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6' },
  { name: 'LINK', address: '0xb0897686c545045afc77cf20ec7a532e3120e0f1' },
  { name: 'LINK', address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39' },
  { name: 'FRAX', address: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89' },
  { name: 'LDO', address: '0xc3c7d422809852031b44ab29eec9f1eff2a58756' },
  { name: 'SAND', address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683' },
  { name: 'AAVE', address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b' }
];

const avaxTokens = [
  { name: 'AVAX', address: '0x' },
  { name: 'USDT', address: '0xc7198437980c041c805a1edcba50c1ce5db95118' },
  { name: 'USDT.e', address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7' },
  { name: 'USDC.e', address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664' },
  { name: 'USDC', address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e' },
  { name: 'BUSD.e', address: '0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98' },
  { name: 'BUSD', address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39' },
  { name: 'DAI.e', address: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70' },
  { name: 'WAVAX', address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' },
  { name: 'WBTC.e', address: '0x50b7545627a5162f82a992c33b87adc75187b218' },
  { name: 'LINK.e', address: '0x5947bb275c521040051d82396192181b413227a3' },
  { name: 'FRAX', address: '0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64' },
  { name: 'AAVE.e', address: '0x63a72806098bd3d9520cc43356dd78afe5d386d9' }
];

const calculateWalletTokenData = async (
  client: Web3,
  tokenAddress: string,
  walletAddress: string,
  name: string,
  price: number,
  chain: string,
  totalValueObj: Record<string, number>
) => {
  let balance;

  if (tokenAddress === '0x') {
    balance = parseFloat(client.utils.fromWei(await client.eth.getBalance(walletAddress)));
  } else {
    const contract = new client.eth.Contract(walletABI, tokenAddress);
    const result = await contract.methods.balanceOf(walletAddress).call();
    const decimals = 18 - (await contract.methods.decimals().call());
    balance = parseFloat(client.utils.fromWei(result)) * 10 ** decimals;
  }

  const value = balance * price;

  totalValueObj[chain] += value;

  return {
    name,
    balance,
    chain,
    price,
    chainImg: chainImages[chain],
    tokenImg: tokenImages[name],
    usdValue: value
  } as WalletTokenItem;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<WalletResponse>) {
  res.setHeader('Cache-Control', 's-maxage=3600');
  const { address } = req.query;

  if (!address) return res.status(400).end();

  const price = await fetchPrices();

  if (!price) return res.status(500).end();

  const totalValues = {
    ETH: 0,
    BSC: 0,
    TPLS: 0
  };

  const ethPromises: Promise<WalletTokenItem>[] = [];
  const bscPromises: Promise<WalletTokenItem>[] = [];
  const tplsPromises: Promise<WalletTokenItem>[] = [];
  const maticPromises: Promise<WalletTokenItem>[] = [];
  const avaxPromises: Promise<WalletTokenItem>[] = [];

  ethTokens.forEach((token) => {
    ethPromises.push(
      calculateWalletTokenData(
        ethClient,
        token.address,
        address as string,
        token.name,
        price[token.name],
        'ETH',
        totalValues
      )
    );
  });

  bscTokens.forEach((token) => {
    bscPromises.push(
      calculateWalletTokenData(
        bscClient,
        token.address,
        address as string,
        token.name,
        price[token.name],
        'BSC',
        totalValues
      )
    );
  });

  tplsTokens.forEach((token) => {
    tplsPromises.push(
      calculateWalletTokenData(
        tplsClient,
        token.address,
        address as string,
        token.name,
        price[token.name === 'HEX' ? 'TPLS_HEX' : token.name],
        'TPLS',
        totalValues
      )
    );
  });

  maticTokens.forEach((token) => {
    maticPromises.push(
      calculateWalletTokenData(
        maticClient,
        token.address,
        address as string,
        token.name,
        price[token.name],
        'MATIC',
        totalValues
      )
    );
  });

  avaxTokens.forEach((token) => {
    const tokenName = token.name.endsWith('.e') ? token.name.slice(0, -2) : token.name;

    avaxPromises.push(
      calculateWalletTokenData(
        avaxClient,
        token.address,
        address as string,
        tokenName,
        price[tokenName],
        'AVAX',
        totalValues
      )
    );
  });

  let data = await Promise.all([
    Promise.all(ethPromises),
    Promise.all(bscPromises),
    Promise.all(tplsPromises),
    Promise.all(maticPromises),
    Promise.all(avaxPromises)
  ]);

  const filteredEthData: WalletTokenItem[] = [];
  const filteredBscData: WalletTokenItem[] = [];
  const filtereTplsData: WalletTokenItem[] = [];
  const filtereMaticData: WalletTokenItem[] = [];
  const filtereAvaxData: WalletTokenItem[] = [];

  let ethTotal = 0;
  let bscTotal = 0;
  let tplsTotal = 0;
  let maticTotal = 0;
  let avaxTotal = 0;

  data[0].map((item) => {
    if (item.usdValue > 0) {
      filteredEthData.push(item);
      ethTotal += item.usdValue;
    }
  });

  data[1].map((item) => {
    if (item.usdValue > 0) {
      filteredBscData.push(item);
      bscTotal += item.usdValue;
    }
  });

  data[2].map((item) => {
    if (item.usdValue > 0) {
      filtereTplsData.push(item);
      tplsTotal += item.usdValue;
    }
  });

  data[3].map((item) => {
    if (item.usdValue > 0) {
      filtereMaticData.push(item);
      maticTotal += item.usdValue;
    }
  });

  data[4].map((item) => {
    if (item.usdValue > 0) {
      filtereAvaxData.push(item);
      avaxTotal += item.usdValue;
    }
  });

  const resObj = {
    data: {
      ETH: {
        data: filteredEthData,
        totalValue: ethTotal
      },
      BSC: {
        data: filteredBscData,
        totalValue: bscTotal
      },
      TPLS: {
        data: filtereTplsData,
        totalValue: tplsTotal
      },
      MATIC: {
        data: filtereMaticData,
        totalValue: maticTotal
      },
      AVAX: {
        data: filtereAvaxData,
        totalValue: avaxTotal
      }
    }
  } as WalletResponse;

  res.status(200).json(resObj);
}
