import { fetchPrices } from '@app-src/services/web3';
import { PriceResponse } from '@app-src/types/api';
import type { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<PriceResponse>) {
  try {
    res.setHeader('Cache-Control', 's-maxage=3600');

    const price = await fetchPrices();

    if (!price) return res.status(500).end();

    return res.send(price);
  } catch (err) {
    res.status(500).end();
  }
}
