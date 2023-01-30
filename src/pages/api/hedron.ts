import { HedronResponse } from '@app-src/server/hedron';
import { hedronABI, hedronStakeABI } from '@app-src/services/abi';
import {
  API_PRICE_URL,
  roundToPrecision,
  tplsClient,
  web3ResponseToObject
} from '@app-src/services/web3';
import { HedronItem, PriceResponse } from '@app-src/types/api';
import { withTypedApiRoute } from '@app-src/utils/tapi';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import { z } from 'zod';

const HedronInstancedStake = z.object({
  stakeId: z.coerce.number(),
  stakedHearts: z.coerce.number(),
  stakeShares: z.coerce.number(),
  lockedDay: z.coerce.number(),
  stakedDays: z.coerce.number(),
  unlockedDay: z.coerce.number(),
  isAutoStake: z.boolean()
});

const HedronShare = z.object({
  mintedDays: z.coerce.number()
});

type NftDetail = {
  attributes: Record<string, number>[];
};

const HEDRON_STAKE_ADDRESS = '0x3819f64f282bf135d62168C1e513280dAF905e06';
const HEDRON_ADDRESS = '0x8BD3d1472A656e312E94fB1BbdD599B8C51D18e3';
const URI = 'https://mainnet.infura.io/v3/083f9de389b741b8896f61446153d1cd';

const web3Client = new Web3(URI);
const hsiEthContract = new web3Client.eth.Contract(hedronABI, HEDRON_ADDRESS);
const hsiEthStakeContract = new web3Client.eth.Contract(hedronStakeABI, HEDRON_STAKE_ADDRESS);
const hsiTplsContract = new tplsClient.eth.Contract(hedronABI, HEDRON_ADDRESS);
const hsiTplsStakeContract = new tplsClient.eth.Contract(hedronStakeABI, HEDRON_STAKE_ADDRESS);

const calculateHedronTokenizedStake = async (
  contract: Contract,
  address: string,
  index: number,
  price: number
) => {
  const nftID = await contract.methods.tokenOfOwnerByIndex(address, index).call();
  const NFT_URL = `https://api.hedron.pro/1/hsi/${nftID}`;

  const nftDetailsResponse = await fetch(NFT_URL);
  const nftDetails: NftDetail = await nftDetailsResponse.json();
  const nftDetailsAttributes = nftDetails.attributes;

  const hexStaked = nftDetailsAttributes[1].value;
  const value = roundToPrecision(hexStaked * price, 2);

  const resObj = {
    stakeType: 'Tokenized',
    tShares: nftDetailsAttributes[0].value,
    hedronMintable: nftDetailsAttributes[2].value,
    servedDays: nftDetailsAttributes[3].value,
    bonus: nftDetailsAttributes[6].value,
    usdValue: value,
    hexStaked
  } as HedronItem;

  return resObj;
};

const calculateHedronInstancedStake = async (
  contract: Contract,
  stakeContract: Contract,
  address: string,
  index: number,
  price: number
) => {
  const stake = web3ResponseToObject(
    HedronInstancedStake,
    [
      'stakeId',
      'stakedHearts',
      'stakeShares',
      'lockedDay',
      'stakedDays',
      'unlockedDay',
      'isAutoStake'
    ],
    await contract.methods.stakeLists(address, index).call()
  );
  const shareList = web3ResponseToObject(
    HedronShare,
    ['stake', 'mintedDays'],
    await stakeContract.methods.shareList(stake.stakeId).call()
  );

  const value = roundToPrecision((price * stake.stakedHearts) / 10e7, 2);
  const tShares = stake.stakeShares / 10e11;
  const hexStaked = stake.stakedHearts / 10e7;

  const today = new Date();
  const startDate = new Date('4/12/2019');
  const NUM_OF_MILISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
  const days = Math.round(
    Math.abs(today.valueOf() - startDate.valueOf()) / NUM_OF_MILISECONDS_IN_ONE_DAY
  );
  let servedDays = days - stake.lockedDay;

  if (servedDays > stake.stakedDays) servedDays = stake.stakedDays;

  const mintedDays = shareList.mintedDays;
  const hedronMintable = (stake.stakeShares / 10e7) * (servedDays - mintedDays);

  const resObj = {
    stakeType: 'Instanced',
    tShares,
    hexStaked,
    servedDays,
    hedronMintable,
    bonus: 0,
    usdValue: value
  } as HedronItem;

  return resObj;
};

const calculateHedronStake = async (address: string, type: 'ETH' | 'TPLS', hedronPrice: number) => {
  let stakes: HedronItem[] = [];

  const contract = type === 'ETH' ? hsiEthContract : hsiTplsContract;
  const stakeContract = type === 'ETH' ? hsiEthStakeContract : hsiTplsStakeContract;
  const hedronBalance = Number((await contract.methods.balanceOf(address).call()) || 0);
  const hedronStakeCount = Number((await contract.methods.hsiCount(address).call()) || 0);

  if (hedronBalance !== 0) {
    const hedronTokenizedPromises: Promise<HedronItem>[] = [];

    for (let i = 0; i < hedronBalance; i++) {
      hedronTokenizedPromises.push(
        calculateHedronTokenizedStake(contract, address, i, hedronPrice)
      );
    }

    stakes = stakes.concat(await Promise.all(hedronTokenizedPromises));
  }

  if (hedronStakeCount !== 0) {
    const hedronInstancedPromises: Promise<HedronItem>[] = [];

    for (let i = 0; i < hedronStakeCount; i++) {
      hedronInstancedPromises.push(
        calculateHedronInstancedStake(contract, stakeContract, address, i, hedronPrice)
      );
    }

    stakes = stakes.concat(await Promise.all(hedronInstancedPromises));
  }

  return stakes;
};

export default withTypedApiRoute(
  z.object({ address: z.string() }),
  HedronResponse,
  async ({ input }) => {
    const priceResponse = await fetch(API_PRICE_URL);
    const price: PriceResponse = await priceResponse.json();

    const ethHedronStakePromise = calculateHedronStake(input.address, 'ETH', price['HEX']);
    const tplsHedronStakePromise = calculateHedronStake(input.address, 'TPLS', price['TPLS_HEX']);

    const stakeData = await Promise.all([ethHedronStakePromise, tplsHedronStakePromise]);

    const filteredStakes: HedronItem[][] = [[], []];
    const stakesTotal = [0, 0];

    for (let i = 0; i < filteredStakes.length; i++) {
      for (let j = 0; j < stakeData[i].length; j++) {
        if (stakeData[i][j].usdValue > 0) {
          filteredStakes[i].push(stakeData[i][j]);
          stakesTotal[i] += stakeData[i][j].usdValue;
        }
      }
    }

    const resObj = {
      data: {
        ETH: {
          data: filteredStakes[0],
          totalValue: stakesTotal[0]
        },
        TPLS: {
          data: filteredStakes[1],
          totalValue: stakesTotal[1]
        }
      }
    };

    return resObj;
  }
);
