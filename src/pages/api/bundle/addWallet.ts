import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { address, wallet } = req.body;

      if (!address || !wallet) return res.status(400);

      const response = await fetch(
        `https://phiat.exchange/PhattyWallet?add=${address}&wallet=${wallet}&action=Add&tk=fhasilfhiosadfh529038`
      );
      const data = response.json();

      res.status(200).send({ data });
    } catch (err) {
      res
        .status(500)
        .send({ data: {}, error: 'An error occured while trying to process the request' });
    }
  } else {
    res.status(405).send({ error: 'Only POST requests allowed' });
  }
}
