import { tokenImages } from '@app-src/services/web3';
import { SushiItem, SushiResponse } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'urql';

type SushiLiquidityPositionItem = {
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
  url: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange'
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
  } as SushiItem;

  return resObj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SushiResponse>) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');
    const { address } = req.query;

    if (!address || typeof address === 'object') return res.status(400);

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

    let sushiData: SushiItem[] = [];

    if (positionData.data.user) {
      const liquidityPositions: SushiLiquidityPositionItem[] =
        positionData.data.user.liquidityPositions;

      const uniPairPromises: Promise<SushiItem>[] = [];

      liquidityPositions.forEach((position) => {
        const balance = Number(position.liquidityTokenBalance);

        if (balance > 0) uniPairPromises.push(calculateUniV2Pair(position.pair.id, balance));
      });

      sushiData = await Promise.all(uniPairPromises);
    }

    const filteredSushiData: SushiItem[] = [];
    let totalValue = 0;

    for (let i = 0; i < sushiData.length; i++) {
      if (sushiData[i].usdValue > 0) {
        filteredSushiData.push(sushiData[i]);
        totalValue += sushiData[i].usdValue;
      }
    }

    const resObj = {
      data: {
        LIQUIDITY_POOL: {
          data: filteredSushiData,
          totalValue
        }
      }
    } as SushiResponse;

    res.status(200).send(resObj);
  } catch (err) {
    res.status(500);
  }
}
