import { hedronABI } from '@app-src/services/abi';
import { fetchPrices, roundToPrecision, tplsClient } from '@app-src/services/web3';
import { HedronItem, HedronResponse } from '@app-src/types/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';

type NftDetail = {
  attributes: Record<string, number>[];
};

const HEDRON_ADDRESS = '0x8BD3d1472A656e312E94fB1BbdD599B8C51D18e3';
const URI = 'https://mainnet.infura.io/v3/083f9de389b741b8896f61446153d1cd';

const web3Client = new Web3(URI);
const hsiEthContract = new web3Client.eth.Contract(hedronABI, HEDRON_ADDRESS);
const hsiTplsContract = new tplsClient.eth.Contract(hedronABI, HEDRON_ADDRESS);

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
  address: string,
  index: number,
  price: number
) => {
  const stake: any[] = await contract.methods.stakeLists(address, index).call();
  const stakedHearts = Number(stake[1]);
  const stakedShares = Number(stake[2]);

  const value = roundToPrecision((price * stakedHearts) / 10e7, 2);
  const tShares = stakedShares / 10e11;
  const hexStaked = stakedHearts / 10e7;

  const resObj = {
    stakeType: 'Instanced',
    tShares,
    hexStaked,
    hedronMintable: 0,
    servedDays: 0,
    bonus: 0,
    usdValue: value
  } as HedronItem;

  return resObj;
};

const calculateHedronStake = async (address: string, type: 'ETH' | 'TPLS', hedronPrice: number) => {
  let stakes: HedronItem[] = [];

  const contract = type === 'ETH' ? hsiEthContract : hsiTplsContract;
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
        calculateHedronInstancedStake(contract, address, i, hedronPrice)
      );
    }

    stakes = stakes.concat(await Promise.all(hedronInstancedPromises));
  }

  return stakes;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const address = req.query.address;

    if (!address || typeof address === 'object') return res.status(400).end();

    const price = await fetchPrices();

    if (!price) return res.status(500).end();

    const ethHedronStakePromise = calculateHedronStake(address, 'ETH', price['HEX']);
    const tplsHedronStakePromise = calculateHedronStake(address, 'TPLS', price['TPLS_HEX']);

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
    } as HedronResponse;

    res.status(200).send(resObj);
  } catch (err) {
    res.status(500).end();
  }
}
