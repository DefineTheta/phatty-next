import { XEN_ABI } from '@app-src/services/abi';
import {
  avaxClient,
  bscClient,
  chainImages,
  dogeClient,
  ethClient,
  ethwClient,
  evmosClient,
  ftmClient,
  glmrClient,
  maticClient,
  okcClient,
  withWeb3ApiRoute
} from '@app-src/services/web3';
import { XenMintItem, XenResponse, XenStakeItem } from '@app-src/types/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Contract } from 'web3-eth-contract';

type StakeDetail = {
  term: number;
  maturityTs: number;
  amount: number;
  apy: number;
};

type MintDetail = {
  user: string;
  term: number;
  maturityTs: number;
  rank: number;
  amplifier: number;
  eaaRate: number;
};

const XEN_ETH_ADDRESS = '0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8';
const XEN_BSC_ADDRESS = '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e';
const XEN_MATIC_ADDRESS = '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e';
const XEN_AVAX_ADDRESS = '0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389';
const XEN_FTM_ADDRESS = '0xeF4B763385838FfFc708000f884026B8c0434275';
const XEN_GLMR_ADDRESS = '0xb564A5767A00Ee9075cAC561c427643286F8F4E1';
const XEN_EVMOS_ADDRESS = '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e';
const XEN_DOGE_ADDRESS = '0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e';
const XEN_OKC_ADDRESS = '0x1cC4D981e897A3D2E7785093A648c0a75fAd0453';
const XEN_ETHW_ADDRESS = '0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e';

const contracts = [
  { name: 'ETH', contract: new ethClient.eth.Contract(XEN_ABI, XEN_ETH_ADDRESS) },
  { name: 'BSC', contract: new bscClient.eth.Contract(XEN_ABI, XEN_BSC_ADDRESS) },
  { name: 'MATIC', contract: new maticClient.eth.Contract(XEN_ABI, XEN_MATIC_ADDRESS) },
  { name: 'AVAX', contract: new avaxClient.eth.Contract(XEN_ABI, XEN_AVAX_ADDRESS) },
  { name: 'FTM', contract: new ftmClient.eth.Contract(XEN_ABI, XEN_FTM_ADDRESS) },
  { name: 'GLMR', contract: new glmrClient.eth.Contract(XEN_ABI, XEN_GLMR_ADDRESS) },
  { name: 'EVMOS', contract: new evmosClient.eth.Contract(XEN_ABI, XEN_EVMOS_ADDRESS) },
  { name: 'DOGE', contract: new dogeClient.eth.Contract(XEN_ABI, XEN_DOGE_ADDRESS) },
  { name: 'OKC', contract: new okcClient.eth.Contract(XEN_ABI, XEN_OKC_ADDRESS) },
  { name: 'ETHW', contract: new ethwClient.eth.Contract(XEN_ABI, XEN_ETHW_ADDRESS) }
];

const calculateXen = async (
  contract: Contract,
  address: string,
  price: number,
  chainName: string
) => {
  const walletBalancePromise = await contract.methods.balanceOf(address).call();
  const stakeDetailsPromise = await contract.methods.userStakes(address).call();
  const mintDetailsPromise = await contract.methods.userMints(address).call();
  const globalRankPromise = await contract.methods.globalRank().call();

  const [walletBalance, stakeDetails, mintDetails, globalRank] = await Promise.all<
    [number, StakeDetail, MintDetail, number]
  >([walletBalancePromise, stakeDetailsPromise, mintDetailsPromise, globalRankPromise]);

  const chainImg = chainImages[chainName];
  const walletAmount = Number(walletBalance) / 10e17;
  const stakedAmount = Number(stakeDetails.amount) / 10e17;
  const estimatedXen = Math.floor(
    Math.floor(Math.log2(Math.max(Number(globalRank) - Number(mintDetails.rank), 2))) *
      3000 *
      Number(mintDetails.term) *
      1.1
  );

  const stake = {
    balance: walletAmount,
    staked: stakedAmount,
    term: Number(stakeDetails.term),
    usdValue: (walletAmount + stakedAmount) * price,
    chain: chainName,
    chainImg
  } as XenStakeItem;

  const mint = {
    term: Number(mintDetails.term),
    rank: Number(mintDetails.rank),
    usdValue: estimatedXen * price,
    estimatedXen,
    chain: chainName,
    chainImg
  } as XenMintItem;

  return [stake, mint] as [XenStakeItem, XenMintItem];
};

export default withWeb3ApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse<XenResponse>) {
    const { address, page, price } = req.middleware;

    const stakingData: XenStakeItem[] = [];
    const mintingData: XenMintItem[] = [];
    let stakingTotal = 0;
    let mintingTotal = 0;

    const isLastPage = page * 5 >= contracts.length;
    const promises: Promise<[XenStakeItem, XenMintItem]>[] = [];

    for (let i = (page - 1) * 5; i < (isLastPage ? contracts.length : page * 5); i++) {
      const data = contracts[i];
      const xenPrice = price[`XEN_${data.name}`] || price['XEN'];

      promises.push(calculateXen(data.contract, address, xenPrice, data.name));
    }

    const data = await Promise.all(promises);

    data.forEach((item) => {
      if (item[0].usdValue > 0) {
        stakingData.push(item[0]);
        stakingTotal += item[0].usdValue;
      }

      if (item[1].usdValue > 0) {
        mintingData.push(item[1]);
        mintingTotal += item[1].usdValue;
      }
    });

    const resObj = {
      data: {
        STAKING: {
          data: stakingData,
          totalValue: stakingTotal
        },
        MINTING: {
          data: mintingData,
          totalValue: mintingTotal
        }
      },
      next: !isLastPage ? page + 1 : null
    } as XenResponse;

    res.status(200).json(resObj);
  },
  {
    isPaginated: true
  }
);
