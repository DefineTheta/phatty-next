import { fetchPrices, hexETHContract, hexPLSContract } from '@app-src/services/web3';
import { HexResponse, HexTokenItem } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'web3-eth-contract';

export type HexStake = {
  stakeId: number;
  stakedHearts: bigint;
  stakeShares: bigint;
  lockedDay: number;
  stakedDays: number;
  isAutoStake: boolean;
};

export type HexDailyData = {
  payout: bigint;
  shares: bigint;
  sats: bigint;
};

const HEARTS_UINT_SHIFT = 72n;
const HEARTS_MASK = (1n << HEARTS_UINT_SHIFT) - 1n;
const SATS_UINT_SHIFT = 56n;
const SATS_MASK = (1n << SATS_UINT_SHIFT) - 1n;

const decodeDailyData = (encDay: any): HexDailyData => {
  let v = BigInt(encDay);
  const payout = v & HEARTS_MASK;
  v = v >> HEARTS_UINT_SHIFT;
  const shares = v & HEARTS_MASK;
  v = v >> HEARTS_UINT_SHIFT;
  const sats = v & SATS_MASK;
  return { payout, shares, sats };
};

export const addDays = (date: Date, days: number) => {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() + days);

  return newDate;
};

const getDataRange = async (hex: any, b: any, e: any) => {
  const dataRange = await hex.methods.dailyDataRange(b, e).call();
  const data: HexDailyData[] = [];
  for (let i = 0; i < dataRange.length; i++) {
    data.push(decodeDailyData(dataRange[i]));
  }
  return data;
};

const interestForDay = (dayObj: HexDailyData, myShares: bigint) => {
  return (myShares * dayObj.payout) / dayObj.shares;
};

const interestForRange = (dailyData: HexDailyData[], myShares: bigint) => {
  return dailyData.reduce((prev, cur) => prev + interestForDay(cur, myShares), 0n);
};

const getLastDataDay = async (hex: Contract) => {
  const globalInfo = await hex.methods.globalInfo().call();
  const lastDay = globalInfo[4];
  return Number.parseInt(lastDay);
};

export const getInterestToDate = async (hex: Contract, stake: HexStake) => {
  const lockedDay = stake.lockedDay;
  const lastDataDay = await getLastDataDay(hex); // ostensibly "today"

  if (lockedDay >= lastDataDay) return 0n;
  else {
    const data = await getDataRange(hex, lockedDay, lastDataDay);
    return interestForRange(data, stake.stakeShares);
  }
};

const getGlobalShares = async (hex: Contract) => {
  const globalInfo = await hex.methods.globalInfo().call();
  let globalShares = Number(globalInfo[5]);
  globalShares = globalShares / 1e12;
  return globalShares;
};

const calculateHexStake = async (
  contractType: 'ETHEREUM' | 'TPLS',
  address: string,
  index: number,
  startDate: Date,
  today: Date,
  globalShares: number,
  hexPrice: number
) => {
  const contract = contractType === 'ETHEREUM' ? hexETHContract : hexPLSContract;

  const stake: HexStake = await contract.methods.stakeLists(address, index).call();
  stake.stakedHearts = BigInt(stake.stakedHearts);
  stake.stakeShares = BigInt(stake.stakeShares);
  stake.lockedDay = Number(stake.lockedDay);
  stake.stakedDays = Number(stake.stakedDays);

  const endDate = addDays(startDate, stake.lockedDay + stake.stakedDays);
  const days = ((endDate.getTime() - today.getTime()) / 86400000).toFixed(0);
  const totalInterestToDate = await getInterestToDate(contract, stake);
  const totalValue = Number(stake.stakedHearts + totalInterestToDate);
  const totalShares = Number(stake.stakeShares) / 10e11;

  // const oldTotalUSD = (((this.#prices['HEX'] || 1) * 1 * totalValue) / 10e7).toFixed(0);
  const totalUSD = (hexPrice * totalValue) / 10e7;
  // hexBal += totalUSD;
  const newTotalValue = totalValue / 10e7;
  const newTotalInterestToDate = Number(totalInterestToDate) / 10e7;
  const TSharesP = (totalShares / globalShares) * 100;

  const res = {
    stakingEnd: days,
    totalBalance: newTotalValue,
    totalInt: newTotalInterestToDate,
    usdValue: totalUSD,
    tShares: totalShares,
    tSharesPercentage: TSharesP
  } as HexTokenItem;

  return res;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<HexResponse>) {
  res.setHeader('Cache-Control', 's-maxage=3600');
  const { address } = req.query;

  if (!address) return res.status(400).end();

  let page: number = Number(req.query.page || 1);

  if (page < 1) return res.status(400).end();

  const price = await fetchPrices();

  if (!price) return res.status(500).end();

  const globalETHShares = await getGlobalShares(hexETHContract);
  const globalPLSShares = await getGlobalShares(hexPLSContract);
  const ethStakeCount = await hexETHContract.methods.stakeCount(address).call();
  const plsStakeCount = await hexPLSContract.methods.stakeCount(address).call();

  const startDate = new Date('2019-12-03');
  const today = new Date();

  const ethPromises: Promise<HexTokenItem>[] = [];
  const tplsPromises: Promise<HexTokenItem>[] = [];

  const ethStakeCountGreater = ethStakeCount > page * 25;
  const plsStakeCountGreater = plsStakeCount > page * 25;

  for (let i = (page - 1) * 25; i < (ethStakeCountGreater ? page * 25 : ethStakeCount); i++) {
    ethPromises.push(
      calculateHexStake(
        'ETHEREUM',
        address as string,
        i,
        startDate,
        today,
        globalETHShares,
        price['HEX']
      )
    );
  }

  for (let i = (page - 1) * 25; i < (plsStakeCountGreater ? page * 25 : plsStakeCount); i++) {
    tplsPromises.push(
      calculateHexStake(
        'TPLS',
        address as string,
        i,
        startDate,
        today,
        globalPLSShares,
        price['TPLS_HEX']
      )
    );
  }

  let data = await Promise.all([Promise.all(ethPromises), Promise.all(tplsPromises)]);

  const filteredEthereumHexStake: HexTokenItem[] = [];
  const ethereumHexTotals = {
    value: 0,
    tSharesPercentage: 0
  };
  const filteredTplsHexStake: HexTokenItem[] = [];
  const tplsHexTotals = {
    value: 0,
    tSharesPercentage: 0
  };

  data[0].forEach((item) => {
    if (item.usdValue > 0) {
      filteredEthereumHexStake.push(item);
      ethereumHexTotals.value += item.usdValue;
      ethereumHexTotals.tSharesPercentage += item.tSharesPercentage;
    }
  });
  data[1].forEach((item) => {
    if (item.usdValue > 0) {
      filteredTplsHexStake.push(item);
      tplsHexTotals.value += item.usdValue;
      tplsHexTotals.tSharesPercentage += item.tSharesPercentage;
    }
  });

  const resObj = {
    data: {
      ETHEREUM: {
        data: filteredEthereumHexStake,
        totalValue: ethereumHexTotals.value,
        totalTSharesPercentage: ethereumHexTotals.tSharesPercentage
      },
      TPLS: {
        data: filteredTplsHexStake,
        totalValue: tplsHexTotals.value,
        totalTSharesPercentage: tplsHexTotals.tSharesPercentage
      }
    },
    next: ethStakeCountGreater || plsStakeCountGreater ? page + 1 : null
  } as HexResponse;

  res.status(200).json(resObj);
}
