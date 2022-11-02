import { uniFactoryABI, unIMinABI, uniNftABI, uniPoolABI } from '@app-src/services/abi';
import { tokenImages } from '@app-src/services/web3';
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

const UNI_NFT_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
const UNI_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

const API_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const web3 = new Web3('https://mainnet.infura.io/v3/e562ddd4a82c45a8aefbff23ce885b03');
let nftContract = new web3.eth.Contract(uniNftABI, UNI_NFT_ADDRESS);
let factoryContract = new web3.eth.Contract(uniFactoryABI, UNI_FACTORY_ADDRESS);

const graphClient = createClient({
  url: API_URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');
    const { address } = req.query;

    if (!address || typeof address === 'object') return res.status(400);

    const nftCount: number = Number(await nftContract.methods.balanceOf(address).call());

    for (let i = 0; i < nftCount; i++) {
      const nftId: string = await nftContract.methods.tokenOfOwnerByIndex(address, i).call();
      const positions: UniNftPosition = await nftContract.methods.positions(nftId).call();

      if (Number(positions.liquidity) > 0) {
        positions.feeGrowthInside0LastX128 = Number(positions.feeGrowthInside0LastX128);
        positions.feeGrowthInside1LastX128 = Number(positions.feeGrowthInside1LastX128);

        const tokenOneContract = new web3.eth.Contract(unIMinABI, positions.token0);
        const tokenTwoContract = new web3.eth.Contract(unIMinABI, positions.token1);

        const poolAddress: string = await factoryContract.methods
          .getPool(positions.token0, positions.token1, positions.fee)
          .call();
        const poolContract = new web3.eth.Contract(uniPoolABI, poolAddress);

        const tokenOneSymbolPromise = await tokenOneContract.methods.symbol().call();
        const tokenTwoSymbolPromise = await tokenTwoContract.methods.symbol().call();
        const tokenOneDecimalsPromise = await tokenOneContract.methods.decimals().call();
        const tokenTwoDecimalsPromise = await tokenTwoContract.methods.decimals().call();
        const slotPromise = await poolContract.methods.slot0().call();
        const poolLiquidityPromise = await poolContract.methods.liquidity().call();
        const feeGrowthGlobalOneX128Promise = await poolContract.methods
          .feeGrowthGlobal0X128()
          .call();
        const feeGrowthGlobalTwoX128Promise = await poolContract.methods
          .feeGrowthGlobal1X128()
          .call();

        const [
          tokenOneSymbol,
          tokenTwoSymbol,
          tokenOneDecimals,
          tokenTwoDecimals,
          slot,
          poolLiquidity,
          feeGrowthGlobalOneX128,
          feeGrowthGlobalTwoX128
        ] = await Promise.all<
          [string, string, string, string, UniPoolSlot, string, string, string]
        >([
          tokenOneSymbolPromise,
          tokenTwoSymbolPromise,
          tokenOneDecimalsPromise,
          tokenTwoDecimalsPromise,
          slotPromise,
          poolLiquidityPromise,
          feeGrowthGlobalOneX128Promise,
          feeGrowthGlobalTwoX128Promise
        ]);

        const tokenOne = new Token(
          1,
          positions.token0,
          Number(tokenOneDecimals),
          tokenOneSymbol,
          ''
        );
        const tokenTwo = new Token(
          1,
          positions.token1,
          Number(tokenTwoDecimals),
          tokenTwoSymbol,
          ''
        );
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

        const tokenOneBalance = Number(userPosition.amount0.toSignificant(8));
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
          (1 * 10 ** Number(tokenOneDecimals));
        let tokensOwedTwo =
          (((Number(feeGrowthGlobalTwoX128) -
            positions.feeGrowthInside1LastX128 -
            Number(position.tickLower.feeGrowthOutside1X128) -
            Number(position.tickUpper.feeGrowthOutside1X128)) /
            2 ** 128) *
            Number(positions.liquidity)) /
          (1 * 10 ** Number(tokenTwoDecimals));

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
          }
        };

        console.log(liquidityPoolObj);
      }
    }

    res.status(200).send({});
  } catch (err) {
    res.status(500);
  }
}

// const Web3 = require('web3');
// const JSBI = require('jsbi');
// const ethers = require('ethers');

// const { createClient } = require ('urql');
// const { CurrencyAmount, Token } = require('@uniswap/sdk-core');
// const { FullMath, TickMath, Pool, Position } = require('@uniswap/v3-sdk');

// getUniLP('0x3ddfa8ec3052539b6c9549f12cea2c295cff5296');

// async function getUniLP (userAdd){

//   const userLPs = [];
//   let nftCount = await contractNFT.methods.balanceOf(userAdd).call();

//   for(let i = 0, length1 = nftCount; i < length1; i++){
//     let nftID = await contractNFT.methods.tokenOfOwnerByIndex(userAdd,i).call();
//     let positions = await contractNFT.methods.positions(nftID).call();

//     if (positions.liquidity>0){

//       let contractToken0 = new web3.eth.Contract(minABI,positions.token0);
//       let contractToken1 = new web3.eth.Contract(minABI,positions.token1);
//       let symbolToken0 = await contractToken0.methods.symbol().call();
//       let symbolToken1 = await contractToken1.methods.symbol().call();
//       let decToken0 = await contractToken0.methods.decimals().call();
//       let decToken1 = await contractToken1.methods.decimals().call();

//       let poolAdd = await contractFactory.methods.getPool(positions.token0,positions.token1,positions.fee).call();
//       let contractPool = new web3.eth.Contract(poolABI, poolAdd);
//       let slot0 = await contractPool.methods.slot0().call();
//       let poolLiq = await contractPool.methods.liquidity().call();
//       let feeGrowthGlobal0X128 = await contractPool.methods.feeGrowthGlobal0X128().call();
//       let feeGrowthGlobal1X128 = await contractPool.methods.feeGrowthGlobal1X128().call();
//       let fee = positions.fee*1, sqrtPriceX96 = slot0.sqrtPriceX96, tick = slot0.tick*1;
//       let tokenA = new Token(1,positions.token0,decToken0*1,symbolToken0,'');
//       let tokenB = new Token(1,positions.token1,decToken1*1,symbolToken1,'');
//       const pool = new Pool(tokenA, tokenB, fee, JSBI.BigInt(sqrtPriceX96), JSBI.BigInt(poolLiq), tick);
//       const userPosition =  new Position({ pool, liquidity: positions.liquidity.toString(), tickLower: positions.tickLower*1, tickUpper: positions.tickUpper*1,  });
//       let balToken0 = userPosition.amount0.toSignificant(8);
//       let balToken1= userPosition.amount1.toSignificant(8);

//       const APIURL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
// 	  const tokensQuery = `
// 	  query Pos($id: ID!){
// 	    positions(where: {id: $id})
// 	    {
// 	      liquidity
// 	      token0 {symbol decimals}
// 	      token1 {symbol decimals}
// 	      pool {feeGrowthGlobal0X128}
// 	      feeGrowthInside0LastX128
// 	      tickLower {feeGrowthOutside0X128 feeGrowthOutside1X128}
// 	      tickUpper {feeGrowthOutside0X128 feeGrowthOutside1X128}
// 	    }
// 	  }
// 	  `
// 	  const client = createClient({
// 	    url: APIURL,
// 	  });
// 	  const data = await client.query(tokensQuery, {id: nftID}).toPromise();
// 	  let pos = data.data.positions[0];
//       let tokensOwed0 = ((feeGrowthGlobal0X128 - positions.feeGrowthInside0LastX128 -pos.tickLower.feeGrowthOutside0X128-pos.tickUpper.feeGrowthOutside0X128)/(2**128))*(positions.liquidity*1)/(1*10**decToken0)
//       let tokensOwed1 = ((feeGrowthGlobal1X128 - positions.feeGrowthInside1LastX128 -pos.tickLower.feeGrowthOutside1X128-pos.tickUpper.feeGrowthOutside1X128)/(2**128))*(positions.liquidity*1)/(1*10**decToken1)

//       let thisLP = {
//         "nameToken0":symbolToken0,
//         "nameToken1":symbolToken1,
//         "balToken0":balToken0,
//         "balToken1":balToken1,
//         "feeToken0":tokensOwed0,
//         "feeToken1":tokensOwed1
//       };
//       userLPs.push(thisLP);
//     }
//   }
//   console.log(userLPs);
//   return(userLPs);
// }

// exports.getUniLP = getUniLP;
