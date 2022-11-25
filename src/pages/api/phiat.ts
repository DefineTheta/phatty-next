import { feeABI, tokenABI } from '@app-src/services/abi';
import {
  fetchPrices,
  lendingPoolProviderAddress,
  phiatProviderContract,
  PhiatReserveDataItem,
  PhiatReserveResponse,
  tokenImages,
  tplsClient
} from '@app-src/services/web3';
import { PhiatData, PhiatResponse, PhiatTokenItem } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

const phiatFeeAddress = '0x37838B260DD27565786B6c7E6cC35c0E65a47620';
const phiatTokenAddress = '0x609BFD40359B3656858D83dc4c4E40D4fD34737F';
const plsUsdPriceOracle = '0x2b8a4e53D0d46B91fb581a99893A9791F054b74e';

const phiatFeeContract = new tplsClient.eth.Contract(feeABI, phiatFeeAddress);
const phiatTokenContract = new tplsClient.eth.Contract(tokenABI, phiatTokenAddress);

type UserDataItem = {
  underlyingAsset: string;
  aTokenBalance: number;
  usageAsCollateralEnabledOnUser: boolean;
  variableDebt: number;
  principalStableDebt: number;
  stableBorrowRate: string;
  stableBorrowLastUpdateTimes: string;
};

type UserDataResponse = UserDataItem[];

type UserRewardItem = {
  token: string;
  amount: number;
};

type UserRewardResponse = UserRewardItem[];

type PhiatStakingResponse = {
  stakingToken: string;
  totalSupply: string;
  totalStakedSupply: string;
  stakingTokenPrecisions: string;
  rewardDuration: string;
  unstakeDuration: string;
  withdrawDuration: string;
  rewardsPerToken: UserRewardItem[];
};

const calculatePhiatUserData = async (
  data: UserDataItem,
  reserveData: PhiatReserveDataItem,
  phiatData: PhiatData
) => {
  data.aTokenBalance = Number(data.aTokenBalance);
  data.variableDebt = Number(data.variableDebt);
  data.principalStableDebt = Number(data.principalStableDebt);

  if (data.aTokenBalance > 0) {
    const value = data.aTokenBalance * reserveData.priceInUsd;

    phiatData.LENDING.data.push({
      address: data.underlyingAsset,
      balance: data.aTokenBalance / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.LENDING.totalValue += value;
  }

  if (data.variableDebt > 0) {
    const value = data.variableDebt * reserveData.priceInUsd;

    phiatData.VARIABLE_DEBT.data.push({
      address: data.underlyingAsset,
      balance: data.variableDebt / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.VARIABLE_DEBT.totalValue += value;
  }

  if (data.principalStableDebt > 0) {
    const value = data.principalStableDebt * reserveData.priceInUsd;

    phiatData.STABLE_DEBT.data.push({
      address: data.underlyingAsset,
      balance: data.principalStableDebt / 10 ** reserveData.decimals,
      symbol: reserveData.symbol,
      image: tokenImages[reserveData.symbol],
      usdValue: value
    });

    phiatData.STABLE_DEBT.totalValue += value;
  }
};

const calculatePhiatToken = async (rewardAmount: number, reserve: PhiatReserveDataItem) => {
  const resObj = {
    address: reserve.aTokenAddress,
    symbol: reserve.symbol,
    balance: rewardAmount / 10 ** reserve.decimals,
    image: tokenImages[reserve.symbol],
    usdValue: rewardAmount * reserve.priceInUsd
  } as PhiatTokenItem;

  return resObj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PhiatResponse>) {
  res.setHeader('Cache-Control', 's-maxage=3600');
  const { address } = req.query;

  if (!address || typeof address === 'object') return res.status(400);

  const page: number = Number(req.query.page || 1);

  if (page < 1) return res.status(400);

  const price = await fetchPrices();

  if (!price) return res.status(500);

  const reserverDataPromise = phiatProviderContract.methods
    .getPhiatReserveData(lendingPoolProviderAddress, plsUsdPriceOracle)
    .call();
  const userDataPromise = phiatProviderContract.methods
    .getPhiatUserData(lendingPoolProviderAddress, address)
    .call();
  const stakingDataPromise = phiatProviderContract.methods
    .getPhiatStakingData(phiatFeeAddress)
    .call();
  const userRewardsDataPromise = phiatFeeContract.methods.claimableRewards(address).call();
  const userStakePromise = await phiatFeeContract.methods.stakedBalance(address).call();

  const [phiatReserveData, userData, stakingData, userRewardsData, userStake] = await Promise.all<
    [PhiatReserveResponse, UserDataResponse, PhiatStakingResponse, UserRewardResponse, number]
  >([
    reserverDataPromise,
    userDataPromise,
    stakingDataPromise,
    userRewardsDataPromise,
    userStakePromise
  ]);

  const phiatReserveLookupMap: Record<string, PhiatReserveDataItem> = {};
  const phiatReserveATokenLookupMap: Record<string, PhiatReserveDataItem> = {};

  for (let i = 0; i < phiatReserveData.length; i++) {
    const data = { ...phiatReserveData[i] };
    data.decimals = Number(data.decimals);
    data.priceInUsd = Number(data.priceInUsd) / 10 ** data.decimals / 10 ** 18;
    phiatReserveLookupMap[data.underlyingAsset] = data;
    phiatReserveATokenLookupMap[data.aTokenAddress] = data;
  }

  let phiatData = {
    STABLE_DEBT: {
      data: [],
      totalValue: 0
    },
    VARIABLE_DEBT: {
      data: [],
      totalValue: 0
    },
    LENDING: {
      data: [],
      totalValue: 0
    },
    STAKING: {
      data: [],
      totalValue: 0
    },
    PH_TOKENS: {
      data: [],
      totalValue: 0
    },
    STAKING_APY: 0
  } as PhiatData;

  const userDataCountGreater = userData.length > page * 25;
  const userRewardCountGreater = userRewardsData.length > page * 25;

  const phiatUserDataPromises = [];

  for (let i = (page - 1) * 25; i < (userDataCountGreater ? page * 25 : userData.length); i++) {
    const data = { ...userData[i] };
    const reserveData = phiatReserveLookupMap[data.underlyingAsset];

    phiatUserDataPromises.push(calculatePhiatUserData(data, reserveData, phiatData));
  }

  await Promise.all(phiatUserDataPromises);

  if (userStake > 0) {
    const value = (userStake / 10 ** 18) * price['PHSAC'];

    if (value > 0) {
      phiatData.STAKING.data.push({
        address: '',
        balance: userStake / 10 ** 18,
        symbol: 'PHSAC',
        image: tokenImages['PHSAC'],
        usdValue: value
      });

      phiatData.STAKING.totalValue += value;
    }
  }

  const phiatTokenPromises: Promise<PhiatTokenItem>[] = [];

  for (
    let i = (page - 1) * 25;
    i < (userRewardCountGreater ? page * 25 : userRewardsData.length);
    i++
  ) {
    const rewardAmount = Number(userRewardsData[i].amount);
    const reserve = phiatReserveATokenLookupMap[userRewardsData[i].token];

    if (!reserve) continue;

    phiatTokenPromises.push(calculatePhiatToken(rewardAmount, reserve));
  }

  const phiatTokens = await Promise.all(phiatTokenPromises);

  phiatTokens.forEach((phiatToken) => {
    if (phiatToken.usdValue <= 0) return;

    phiatData.PH_TOKENS.data.push(phiatToken);
    phiatData.PH_TOKENS.totalValue += phiatToken.usdValue;
  });

  const stakingApyUSD = stakingData.rewardsPerToken.reduce((prev, cur) => {
    const reserve = phiatReserveATokenLookupMap[cur.token];

    if (reserve) prev += Number(cur.amount) * reserve.priceInUsd;

    return prev;
  }, 0);

  phiatData.STAKING_APY = (stakingApyUSD * 52) / price['PHSAC'];

  const resObj = {
    data: phiatData,
    next: userDataCountGreater || userRewardCountGreater ? page + 1 : null
  } as PhiatResponse;

  res.status(200).json(resObj);
}
