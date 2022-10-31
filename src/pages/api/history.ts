import { tokenImages } from '@app-src/services/web3';
import { HistoryItem, HistoryResponse } from '@app-src/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<HistoryResponse>) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');
    const { address } = req.query;

    if (!address || typeof address === 'object') return res.status(400);

    const response = await fetch(`https://phiat.finance/history?add=${address}`);
    const data = await response.json();

    const resArr: HistoryItem[] = [];

    data.forEach((item: HistoryItem) => {
      resArr.push({
        chain: item.chain,
        image: tokenImages[item.chain],
        functionName: item.functionName,
        link: item.link,
        tokens: item.tokens.map((token) => {
          token.image = tokenImages[token.token];
          return token;
        })
      });
    });

    res.status(200).send({ data });
  } catch (err) {
    res
      .status(500)
      .send({ data: [], error: 'An error occured while trying to process the request' });
  }
}
