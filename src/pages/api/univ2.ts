import { tokenImages, withWeb3ApiRoute } from '@app-src/services/web3';
import { SushiResponse, UniV2Item, UniV2Response } from '@app-src/types/api';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { createClient } from 'urql';

type UniV2LiquidityPositionItem = {
  pair: {
    id: string;
  };
  liquidityTokenBalance: string;
};

type UniV2PairItem = {
  id: string;
  totalSupply: string;
  reserveUSD: string;
  reserve0: string;
  reserve1: string;
  token0: {
    symbol: string;
  };
  token1: {
    symbol: string;
  };
};

const graphClient = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
});

const calculateUniV2Pair = async (pair: string, balance: number) => {
  const pairData = await graphClient
    .query(
      `
      query pairQuery($id: ID!){
        pair(id: $id) {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          totalSupply
          reserveUSD
          reserve0
          reserve1
        }
      }
      `,
      { id: pair }
    )
    .toPromise();

  const data: UniV2PairItem = pairData.data.pair;
  const ratio = balance / Number(data.totalSupply);
  const tokenOneBalance = Number(data.reserve0) * ratio;
  const tokenTwoBalance = Number(data.reserve1) * ratio;
  const value = Number(data.reserveUSD) * ratio;

  const resObj = {
    tokenOne: {
      symbol: data.token0.symbol,
      image: tokenImages[data.token0.symbol] || '',
      balance: tokenOneBalance
    },
    tokenTwo: {
      symbol: data.token1.symbol,
      image: tokenImages[data.token1.symbol] || '',
      balance: tokenTwoBalance
    },
    usdValue: value
  } as UniV2Item;

  return resObj;
};

export default withWeb3ApiRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SushiResponse>
) {
  const { address } = req.middleware;

  const positionData = await graphClient
    .query(
      `
          query postionQuery($id: ID!){
            user(id: $id) {
              id
              liquidityPositions {
                id
                pair {
                  id
                }
                liquidityTokenBalance
              }
            }
          }
        `,
      { id: address }
    )
    .toPromise();

  let uniV2Data: UniV2Item[] = [];

  if (positionData.data.user) {
    const liquidityPositions: UniV2LiquidityPositionItem[] =
      positionData.data.user.liquidityPositions;

    const uniPairPromises: Promise<UniV2Item>[] = [];

    liquidityPositions.forEach((position) => {
      const balance = Number(position.liquidityTokenBalance);

      if (balance > 0) uniPairPromises.push(calculateUniV2Pair(position.pair.id, balance));
    });

    uniV2Data = await Promise.all(uniPairPromises);
  }

  const filteredUniV2Data: UniV2Item[] = [];
  let totalValue = 0;

  for (let i = 0; i < uniV2Data.length; i++) {
    if (uniV2Data[i].usdValue > 0) {
      filteredUniV2Data.push(uniV2Data[i]);
      totalValue += uniV2Data[i].usdValue;
    }
  }

  const resObj = {
    data: {
      LIQUIDITY_POOL: {
        data: filteredUniV2Data,
        totalValue
      }
    }
  } as UniV2Response;

  res.status(200).send(resObj);
});
