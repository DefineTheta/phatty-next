import { uniFactoryABI, uniNftABI, uniPoolABI } from '@app-src/services/abi';
import { DEFI_LLAMA_URL, tokenImages } from '@app-src/services/web3';
import { UniV3Item, UniV3Response } from '@app-src/types/api';
import { Token } from '@uniswap/sdk-core';
import { Pool, Position } from '@uniswap/v3-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'urql';
import Web3 from 'web3';

type UniNftPosition = {
  nonce: string;
  operator: string;
  token0: string;
  token1: string;
  fee: string;
  tickLower: string;
  tickUpper: string;
  liquidity: string;
  feeGrowthInside0LastX128: number;
  feeGrowthInside1LastX128: number;
  tokensOwed0: string;
  tokensOwed1: string;
};

type UniPoolSlot = {
  sqrtPriceX96: string;
  tick: string;
  observationIndex: string;
  observationCardinality: string;
  observationCardinalityNext: string;
  feeProtocol: string;
  unlocked: boolean;
};

type UniPosition = {
  liquidity: string;
  tickLower: UniPositionTick;
  tickUpper: UniPositionTick;
};

type UniPositionTick = {
  feeGrowthOutside0X128: string;
  feeGrowthOutside1X128: string;
};

type DefiLlamaPriceItem = {
  confidence: number;
  decimals: number;
  price: number;
  symbol: string;
  timestamp: number;
};

type DefiLlamaPriceRespnse = {
  coins: Record<string, DefiLlamaPriceItem>;
};

const UNI_NFT_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const UNI_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const API_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const web3 = new Web3('https://mainnet.infura.io/v3/e562ddd4a82c45a8aefbff23ce885b03');
let nftContract = new web3.eth.Contract(uniNftABI, UNI_NFT_ADDRESS);
let factoryContract = new web3.eth.Contract(uniFactoryABI, UNI_FACTORY_ADDRESS);

const graphClient = createClient({
  url: API_URL
});

const calculateLiquidity = async (positions: UniNftPosition, nftId: string) => {
  positions.feeGrowthInside0LastX128 = Number(positions.feeGrowthInside0LastX128);
  positions.feeGrowthInside1LastX128 = Number(positions.feeGrowthInside1LastX128);

  const poolAddress: string = await factoryContract.methods
    .getPool(positions.token0, positions.token1, positions.fee)
    .call();
  const poolContract = new web3.eth.Contract(uniPoolABI, poolAddress);

  const tokenOneDefiKey = `ethereum:${positions.token0}`;
  const tokenTwoDefiKey = `ethereum:${positions.token1}`;

  const tokenPriceResponse = await fetch(`${DEFI_LLAMA_URL}/${tokenOneDefiKey},${tokenTwoDefiKey}`);
  const slotPromise = poolContract.methods.slot0().call();
  const poolLiquidityPromise = poolContract.methods.liquidity().call();
  const feeGrowthGlobalOneX128Promise = poolContract.methods.feeGrowthGlobal0X128().call();
  const feeGrowthGlobalTwoX128Promise = poolContract.methods.feeGrowthGlobal1X128().call();

  const [slot, poolLiquidity, feeGrowthGlobalOneX128, feeGrowthGlobalTwoX128] = await Promise.all<
    [UniPoolSlot, string, string, string]
  >([
    slotPromise,
    poolLiquidityPromise,
    feeGrowthGlobalOneX128Promise,
    feeGrowthGlobalTwoX128Promise
  ]);

  const tokenPriceData: DefiLlamaPriceRespnse = await tokenPriceResponse.json();

  const tokenOneSymbol = tokenPriceData.coins[tokenOneDefiKey].symbol;
  const tokenTwoSymbol = tokenPriceData.coins[tokenTwoDefiKey].symbol;
  const tokenOneDecimals = tokenPriceData.coins[tokenOneDefiKey].decimals;
  const tokenTwoDecimals = tokenPriceData.coins[tokenTwoDefiKey].decimals;

  const tokenOne = new Token(1, positions.token0, tokenOneDecimals, tokenOneSymbol, '');
  const tokenTwo = new Token(1, positions.token1, tokenTwoDecimals, tokenTwoSymbol, '');

  // Possible error not converting to BigInt
  const pool = new Pool(
    tokenOne,
    tokenTwo,
    Number(positions.fee),
    slot.sqrtPriceX96,
    poolLiquidity,
    Number(slot.tick)
  );
  const userPosition = new Position({
    pool,
    liquidity: positions.liquidity,
    tickLower: Number(positions.tickLower),
    tickUpper: Number(positions.tickUpper)
  });

  const tokenOnePrice = tokenPriceData.coins[`ethereum:${positions.token0}`].price;
  const tokenOneBalance = Number(userPosition.amount0.toSignificant(8));
  const tokenTwoPrice = tokenPriceData.coins[`ethereum:${positions.token1}`].price;
  const tokenTwoBalance = Number(userPosition.amount1.toSignificant(8));

  const data = await graphClient
    .query(
      `
        	  query Pos($id: ID!){
        	    positions(where: {id: $id})
        	    {
        	      liquidity
        	      token0 {symbol decimals}
        	      token1 {symbol decimals}
        	      pool {feeGrowthGlobal0X128}
        	      feeGrowthInside0LastX128
        	      tickLower {feeGrowthOutside0X128 feeGrowthOutside1X128}
        	      tickUpper {feeGrowthOutside0X128 feeGrowthOutside1X128}
        	    }
        	  }
        	  `,
      { id: nftId }
    )
    .toPromise();

  const position: UniPosition = data.data.positions[0];
  const tokensOwedOne =
    (((Number(feeGrowthGlobalOneX128) -
      positions.feeGrowthInside0LastX128 -
      Number(position.tickLower.feeGrowthOutside0X128) -
      Number(position.tickUpper.feeGrowthOutside0X128)) /
      2 ** 128) *
      Number(positions.liquidity)) /
    (1 * 10 ** tokenOneDecimals);
  const tokensOwedTwo =
    (((Number(feeGrowthGlobalTwoX128) -
      positions.feeGrowthInside1LastX128 -
      Number(position.tickLower.feeGrowthOutside1X128) -
      Number(position.tickUpper.feeGrowthOutside1X128)) /
      2 ** 128) *
      Number(positions.liquidity)) /
    (1 * 10 ** tokenTwoDecimals);

  const value =
    (tokenOneBalance + tokensOwedOne) * tokenOnePrice +
    (tokenTwoBalance + tokensOwedTwo) * tokenTwoPrice;

  const liquidityPoolObj = {
    tokenOne: {
      symbol: tokenOneSymbol,
      image: tokenImages[tokenOneSymbol],
      balance: tokenOneBalance,
      fee: tokensOwedOne
    },
    tokenTwo: {
      symbol: tokenTwoSymbol,
      image: tokenImages[tokenTwoSymbol],
      balance: tokenTwoBalance,
      fee: tokensOwedTwo
    },
    usdValue: value
  } as UniV3Item;

  return liquidityPoolObj;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');
    const { address, page } = req.query;

    if (!address || typeof address === 'object' || !page || typeof page === 'object')
      return res.status(400).end();

    const pageCount = Number(page);

    const nftCount: number = Number(await nftContract.methods.balanceOf(address).call());
    const nftCountGreater = nftCount > pageCount * 5;

    const promises: Promise<UniV3Item>[] = [];

    for (let i = (pageCount - 1) * 5; i < (nftCountGreater ? pageCount * 5 : nftCount); i++) {
      const nftId: string = await nftContract.methods.tokenOfOwnerByIndex(address, i).call();
      const positions: UniNftPosition = await nftContract.methods.positions(nftId).call();

      if (Number(positions.liquidity) > 0) promises.push(calculateLiquidity(positions, nftId));
    }

    const liquidityPoolItems = await Promise.all(promises);
    const filteredItems: UniV3Item[] = [];
    let total = 0;

    for (let i = 0; i < liquidityPoolItems.length; i++) {
      if (liquidityPoolItems[i].usdValue > 0) {
        filteredItems.push(liquidityPoolItems[i]);
        total += liquidityPoolItems[i].usdValue;
      }
    }

    const resObj = {
      data: {
        LIQUIDITY_POOL: {
          data: filteredItems,
          totalValue: total
        }
      },
      next: nftCountGreater ? pageCount + 1 : null
    } as UniV3Response;

    res.status(200).send(resObj);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
