import {
  avaxClient,
  bscClient,
  chainImages,
  ethClient,
  ftmClient,
  maticClient,
  tokenImages,
  tplsClient,
  withWeb3ApiRoute
} from '@app-src/services/web3';
import { WalletResponse, WalletTokenItem } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import type Web3 from 'web3';
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

type TokenItem = {
  name: string;
  displayName: string;
  address: string;
};

type ChainItem = {
  name: string;
  client: Web3;
  tokens: TokenItem[];
};

const ethTokens: TokenItem[] = [
  { name: 'ETH', displayName: 'ETH', address: '0x' },
  { name: 'HEX', displayName: 'HEX', address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39' },
  { name: 'HDRN', displayName: 'HDRN', address: '0x3819f64f282bf135d62168C1e513280dAF905e06' },
  { name: 'USDC', displayName: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { name: 'USDT', displayName: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { name: 'BUSD', displayName: 'BUSD', address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53' },
  { name: 'MATIC', displayName: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' },
  { name: 'SHIB', displayName: 'SHIB', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' },
  { name: 'WETH', displayName: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  { name: 'LINK', displayName: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
  { name: 'DAI', displayName: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
  { name: 'MANA', displayName: 'MANA', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942' },
  { name: 'BNB', displayName: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' },
  { name: 'FTM', displayName: 'FTM', address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870' },
  { name: 'WISE', displayName: 'WISE', address: '0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6' },
  { name: 'WBTC', displayName: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  { name: 'STETH', displayName: 'STETH', address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' },
  { name: 'NEAR', displayName: 'NEAR', address: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4' },
  { name: 'APE', displayName: 'APE', address: '0x4d224452801aced8b2f0aebe155379bb5d594381' },
  { name: 'WFIL', displayName: 'WFIL', address: '0x6e1A19F235bE7ED8E3369eF73b196C07257494DE' },
  { name: 'STPT', displayName: 'STPT', address: '0xDe7D85157d9714EADf595045CC12Ca4A5f3E2aDb' },
  { name: 'SAND', displayName: 'SAND', address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0' },
  { name: 'CHZ', displayName: 'CHZ', address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF' },
  { name: 'THETA', displayName: 'THETA', address: '0x3883f5e181fccaF8410FA61e12b59BAd963fb645' },
  { name: 'ZIL', displayName: 'ZIL', address: '0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27' },
  { name: 'GALA', displayName: 'GALA', address: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA' },
  { name: 'AMB', displayName: 'AMB', address: '0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE' },
  { name: 'GMT', displayName: 'GMT', address: '0xe3c408BD53c31C085a1746AF401A4042954ff740' },
  { name: 'TUSD', displayName: 'TUSD', address: '0x0000000000085d4780B73119b644AE5ecd22b376' },
  { name: 'GRT', displayName: 'GRT', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7' },
  { name: 'SNT', displayName: 'SNT', address: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E' },
  { name: 'AERGO', displayName: 'AERGO', address: '0x91Af0fBB28ABA7E31403Cb457106Ce79397FD4E6' },
  { name: 'ENS', displayName: 'ENS', address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72' },
  { name: 'LDO', displayName: 'LDO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32' },
  { name: 'BIT', displayName: 'BIT', address: '0x1A4b46696b2bB4794Eb3D4c26f1c55F9170fa4C5' },
  { name: 'VEN', displayName: 'VEN', address: '0xD850942eF8811f2A866692A623011bDE52a462C1' },
  { name: 'ENJ', displayName: 'ENJ', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c' },
  { name: 'DYDX', displayName: 'DYDX', address: '0x92D6C1e31e14520e676a687F0a93788B716BEff5' },
  // { name: 'LRC', displayName: 'LRC', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD' },
  { name: 'ONE', displayName: 'ONE', address: '0x799a4202c12ca952cB311598a024C80eD371a41e' },
  { name: 'POND', displayName: 'POND', address: '0x57B946008913B82E4dF85f501cbAeD910e58D26C' },
  { name: 'POLY', displayName: 'POLY', address: '0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC' },
  { name: 'STG', displayName: 'STG', address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6' },
  { name: 'SNX', displayName: 'SNX', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' },
  { name: 'OMG', displayName: 'OMG', address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07' },
  { name: 'POWR', displayName: 'POWR', address: '0x595832F8FC6BF59c85C527fEC3740A1b7a361269' },
  { name: 'SUSHI', displayName: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2' },
  { name: 'BAT', displayName: 'BAT', address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF' },
  { name: '1INCH', displayName: '1INCH', address: '0x111111111117dC0aa78b770fA6A738034120C302' },
  { name: 'YFI', displayName: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e' },
  { name: 'GLM', displayName: 'GLM', address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429' },
  { name: 'SYN', displayName: 'SYN', address: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429' },
  { name: 'POLY', displayName: 'POLY', address: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec' },
  { name: 'PLSD', displayName: 'PLSD', address: '0x34F0915a5f15a66Eba86F6a58bE1A471FB7836A7' },
  { name: 'ASIC', displayName: 'ASIC', address: '0x347a96a5bd06d2e15199b032f46fb724d6c73047' },
  { name: 'ICSA', displayName: 'ICSA', address: '0xfc4913214444af5c715cc9f7b52655e788a569ed' },
  { name: 'MAXI', displayName: 'MAXI', address: '0x0d86EB9f43C57f6FF3BC9E23D8F9d82503f0e84b' },
  { name: 'POLY', displayName: 'POLY', address: '0x9d93692e826a4bd9e903e2a27d7fbd1e116efdad' },
  { name: 'TRIO', displayName: 'TRIO', address: '0xF55cD1e399e1cc3D95303048897a680be3313308' },
  { name: 'BASE', displayName: 'BASE', address: '0xe9f84d418B008888A992Ff8c6D22389C2C3504e0' }
];

const bscTokens: TokenItem[] = [
  { name: 'BNB', displayName: 'BNB', address: '0x' },
  { name: 'ETH', displayName: 'ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8' },
  { name: 'USDT', displayName: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955' },
  { name: 'WBNB', displayName: 'WBNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' },
  { name: 'USDC', displayName: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' },
  { name: 'BUSD', displayName: 'BUSD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' },
  { name: 'SHIB', displayName: 'SHIB', address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D' },
  { name: 'DAI', displayName: 'DAI', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3' },
  { name: 'LINK', displayName: 'LINK', address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD' }
];

const tplsTokens: TokenItem[] = [
  { name: 'PLS', displayName: 'PLS', address: '0x' },
  { name: 'USDC', displayName: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { name: 'PLSX', displayName: 'PLSX', address: '0x07895912f3ab0e33ab3a4cefbdf7a3e121eb9942' },
  { name: 'TPLS_HEX', displayName: 'HEX', address: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39' },
  { name: 'INC', displayName: 'INC', address: '0x083f559993227395009596f77496fdc48e84c69a' },
  { name: 'PHIAT', displayName: 'PHIAT', address: '0x240196d9f3bad74e067a11093026b8bc2613b689' },
  { name: 'TPLS_HDRN', displayName: 'HDRN', address: '0x3819f64f282bf135d62168c1e513280daf905e06' },
  { name: 'HELGO', displayName: 'HELGO', address: '0x0567ca0de35606e9c260cc2358404b11de21db44' },
  { name: 'MINT', displayName: 'MINT', address: '0x079d5348d11fc5636f2f569641aa32363888b568' },
  { name: 'PHSAC', displayName: 'PHSAC', address: '0x609BFD40359B3656858D83dc4c4E40D4fD34737F' },
  { name: 'PHAME', displayName: 'PHAME', address: '0xf120Dc7395FE6dDe218d72C9F5188FE280F6c458' }
];

const maticTokens: TokenItem[] = [
  { name: 'MATIC', displayName: 'MATIC', address: '0x' },
  { name: 'WETH', displayName: 'WETH', address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' },
  { name: 'USDT', displayName: 'USDT', address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' },
  { name: 'USDC', displayName: 'USDC', address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
  { name: 'BUSD', displayName: 'BUSD', address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39' },
  { name: 'BUSD', displayName: 'BUSD', address: '0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7' },
  { name: 'DAI', displayName: 'DAI', address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' },
  { name: 'UNI', displayName: 'UNI', address: '0xb33eaad8d922b1083446dc23f610c2567fb5180f' },
  { name: 'AVAX', displayName: 'AVAX', address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b' },
  { name: 'WBTC', displayName: 'WBTC', address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6' },
  { name: 'LINK', displayName: 'LINK', address: '0xb0897686c545045afc77cf20ec7a532e3120e0f1' },
  { name: 'LINK', displayName: 'LINK', address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39' },
  { name: 'FRAX', displayName: 'FRAX', address: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89' },
  { name: 'LDO', displayName: 'LDO', address: '0xc3c7d422809852031b44ab29eec9f1eff2a58756' },
  { name: 'SAND', displayName: 'SAND', address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683' },
  { name: 'AAVE', displayName: 'AAVE', address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b' },
  { name: 'WMATIC', displayName: 'WMATIC', address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' }
];

const avaxTokens: TokenItem[] = [
  { name: 'AVAX', displayName: 'AVAX', address: '0x' },
  { name: 'USDT', displayName: 'USDT', address: '0xc7198437980c041c805a1edcba50c1ce5db95118' },
  { name: 'USDT', displayName: 'USDT.e', address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7' },
  { name: 'USDC', displayName: 'USDC.e', address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664' },
  { name: 'USDC', displayName: 'USDC', address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e' },
  { name: 'BUSD', displayName: 'BUSD.e', address: '0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98' },
  { name: 'BUSD', displayName: 'BUSD', address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39' },
  { name: 'DAI', displayName: 'DAI.e', address: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70' },
  { name: 'WAVAX', displayName: 'WAVAX', address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' },
  { name: 'WBTC', displayName: 'WBTC.e', address: '0x50b7545627a5162f82a992c33b87adc75187b218' },
  { name: 'LINK', displayName: 'LINK.e', address: '0x5947bb275c521040051d82396192181b413227a3' },
  { name: 'FRAX', displayName: 'FRAX', address: '0xd24c2ad096400b6fbcd2ad8b24e7acbc21a1da64' },
  { name: 'AAVE', displayName: 'AAVE.e', address: '0x63a72806098bd3d9520cc43356dd78afe5d386d9' }
];

const ftmTokens: TokenItem[] = [
  { name: 'FTM', displayName: 'FTM', address: '0x' },
  { name: 'MARS', displayName: 'MARS', address: '0xbe41772587872a92184873d55b09c6bb6f59f895' },
  { name: 'WFTM', displayName: 'WFTM', address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83' },
  { name: 'USDC', displayName: 'USDC', address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75' },
  { name: 'BOO', displayName: 'BOO', address: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe' },
  { name: 'SPIRIT', displayName: 'SPIRIT', address: '0x5cc61a78f164885776aa610fb0fe1257df78e59b' },
  { name: 'DAI', displayName: 'DAI', address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e' },
  { name: 'TOMB', displayName: 'TOMB', address: '0x6c021ae822bea943b2e66552bde1d2696a53fbb7' },
  { name: 'TSHARE', displayName: 'TSHARE', address: '0x4cdf39285d7ca8eb3f090fda0c069ba5f4145b37' },
  // { name: 'FUSDT', displayName: 'fUSDT', address: '0x049d68029688eabf473097a2fc38ef61633a3c7a' },
  // { name: 'SHEC', displayName: 'sHEC', address: '0x75bdef24285013387a47775828bec90b91ca9a5f' },
  { name: 'LQDR', displayName: 'LQDR', address: '0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9' },
  { name: 'SPELL', displayName: 'SPELL', address: '0x468003b688943977e6130f4f68f23aad939a1040' },
  { name: 'ETH', displayName: 'ETH', address: '0x74b23882a30290451A17c44f4F05243b6b58C76d' },
  { name: 'MAN', displayName: 'MAN', address: '0x8a88b501a68cea5844b9d95f41892b05c4cd1d73' },
  { name: 'MIM', displayName: 'MIM', address: '0x82f0b8b456c1a451378467398982d4834b6829c1' },
  { name: 'BEETS', displayName: 'BEETS', address: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e' }
];

const CHAIN_DETAILS: ChainItem[] = [
  { name: 'ETH', client: ethClient, tokens: ethTokens },
  { name: 'BSC', client: bscClient, tokens: bscTokens },
  { name: 'TPLS', client: tplsClient, tokens: tplsTokens },
  { name: 'MATIC', client: maticClient, tokens: maticTokens },
  { name: 'AVAX', client: avaxClient, tokens: avaxTokens },
  { name: 'FTM', client: ftmClient, tokens: ftmTokens }
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

export default withWeb3ApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletResponse>
) {
  const { address, price } = req.middleware;

  const totalValues: Record<string, number> = {
    ETH: 0,
    BSC: 0,
    TPLS: 0,
    MATIC: 0,
    AVAX: 0,
    FTM: 0
  };

  const data = await Promise.all(
    CHAIN_DETAILS.map((chain) =>
      Promise.all(
        chain.tokens.map((token) =>
          calculateWalletTokenData(
            chain.client,
            token.address,
            address,
            token.displayName,
            price[token.name],
            chain.name,
            totalValues
          )
        )
      )
    )
  );
  const filteredData = data.map((chainWalletItems) =>
    chainWalletItems.filter((item) => item.usdValue > 0)
  );

  const dataObj = CHAIN_DETAILS.reduce(
    (obj, chain, index) => ({
      ...obj,
      [chain.name]: {
        data: filteredData[index],
        totalValue: totalValues[chain.name]
      }
    }),
    {}
  );

  const resObj = {
    data: dataObj
  } as WalletResponse;

  res.status(200).json(resObj);
});
