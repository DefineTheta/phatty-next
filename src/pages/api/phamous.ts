import { feeABI, minABI, tokenABI } from '@app-src/services/abi';
import { fetchPrices, tokenImages, tplsClient } from '@app-src/services/web3';
import { PhamousResponse } from '@app-src/types/api';

const PHLP_TOKEN_ADDRESS = '0xbB5F9DC3454b02fE5eaF5070C62ad4C055e05F1f';
const PHAME_STAKING_ADDRESS = '0x0914C4Be2b2cBdaBA944E667d3c5244f4dd6b8bd';
const PHAME_TOKEN_ADDRESS = '0xf120Dc7395FE6dDe218d72C9F5188FE280F6c458';

const phameStakingContract = new tplsClient.eth.Contract(feeABI, PHAME_STAKING_ADDRESS);
const phameTokenCotract = new tplsClient.eth.Contract(tokenABI, PHAME_TOKEN_ADDRESS);
const phlpTokenContract = new tplsClient.eth.Contract(minABI, PHLP_TOKEN_ADDRESS);

// let testAdd_ = '0x7503a02714C4a32FE22d04df485404C95a65b670';
// getPhamousStaking(testAdd_);

const phamousStakingRewards = [
  {
    symbol: 'PLS',
    balance: 0,
    address: '0x8a810ea8B121d08342E9e7696f4a9915cBE494B7',
    decimals: 18
  },
  {
    symbol: 'HEX',
    balance: 0,
    address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    decimals: 8
  },
  {
    symbol: 'USDC',
    balance: 0,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6
  },
  {
    symbol: 'HDRN',
    balance: 0,
    address: '0x3819f64f282bf135d62168C1e513280dAF905e06',
    decimals: 9
  },
  {
    symbol: 'LOAN',
    balance: 0,
    address: '0x4F7fCdb511a25099F870EE57c77f7DB2561EC9B6',
    decimals: 18
  },
  {
    symbol: 'PLSX',
    balance: 0,
    address: '0x07895912f3AB0E33aB3a4CEFbdf7a3e121eb9942',
    decimals: 18
  },
  {
    symbol: 'XEN',
    balance: 0,
    address: '0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB',
    decimals: 18
  },
  {
    symbol: 'MAXI',
    balance: 0,
    address: '0xE0d1bd019665956945043c96499c6414Cfc300a9',
    decimals: 8
  }
];

type UserRewardItem = {
  token: string;
  amount: number;
};

type UserRewardResponse = UserRewardItem[];

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');
    const { address } = req.query;

    if (!address || typeof address === 'object') return res.status(400).end();

    const price = await fetchPrices();

    if (!price) return res.status(500);

    const phlpBalancePromise = phlpTokenContract.methods.balanceOf(address).call();
    const userStakePromise = phameStakingContract.methods.stakedBalance(address).call();
    let userRewardsPromise = phameStakingContract.methods.claimableRewards(address).call();

    let [phlpBalance, userStake, userRewards] = await Promise.all<
      [number, number, UserRewardResponse]
    >([phlpBalancePromise, userStakePromise, userRewardsPromise]);

    phlpBalance = Number(phlpBalance);
    userStake = Number(userStake);

    const userRewardsLookupMap: Record<string, UserRewardItem> = {};

    userRewards.forEach((reward) => {
      userRewardsLookupMap[reward.token] = {
        token: reward.token,
        amount: Number(reward.amount)
      };
    });

    const resObj = {
      data: {
        LIQUIDITY_PROVIDING: {
          data: [
            {
              symbol: 'PHLP',
              balance: phlpBalance / 10 ** 18,
              usdValue: 0,
              image: tokenImages['PHLP']
            }
          ],
          totalValue: 0
        },
        STAKING: {
          data: [],
          totalValue: 0
        },
        REWARD: {
          data: [],
          totalValue: 0
        }
      }
    } as PhamousResponse;

    if (userStake > 0) {
      for (let i = 0; i < phamousStakingRewards.length; i++) {
        const reward = userRewardsLookupMap[phamousStakingRewards[i].address];

        if (!reward) continue;

        const balance = reward.amount / 10 ** phamousStakingRewards[i].decimals;
        const value = balance * price[phamousStakingRewards[i].symbol];

        if (value <= 0) continue;

        resObj.data.REWARD.data.push({
          symbol: phamousStakingRewards[i].symbol,
          usdValue: value,
          image: tokenImages[phamousStakingRewards[i].symbol],
          balance
        });

        resObj.data.REWARD.totalValue += value;
      }

      // resObj.data.PHLP.usdValue = (userStake / 10 ** 18) * price['PHAME'];

      const rewardTotalValue = (userStake / 10 ** 18) * price['PHAME'];
      resObj.data.STAKING.data.push({
        symbol: 'PHAME',
        balance: userStake / 10 ** 18,
        usdValue: rewardTotalValue,
        image: tokenImages['PHAME']
      });

      resObj.data.STAKING.totalValue = rewardTotalValue;
    }

    res.status(200).send(resObj);
  } catch (err) {
    res.status(500).end();
  }
}
