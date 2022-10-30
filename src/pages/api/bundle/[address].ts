import { BundleResponse } from '@app-src/types/api';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse<BundleResponse>) {
    try {
      const address = String(req.query.address);
      const { decryptedAddress } = req.session;

      if (!address) return res.status(400);

      if (decryptedAddress !== address)
        return res.status(401).send({ data: [], error: 'Unauthorized' });

      if (req.method === 'GET') {
        const response = await fetch(
          `https://phiat.exchange/PhattyLogin?add=${address}&tk=fhasilfhiosadfh529038`
        );
        const data = await response.json();

        res.status(200).send({ data });
      } else if (req.method === 'POST') {
        const wallet = String(req.body.wallet);

        if (!address || !wallet) return res.status(400);

        const response = await fetch(
          `https://phiat.exchange/PhattyWallet?add=${address}&wallet=${wallet}&action=Add&tk=fhasilfhiosadfh529038`
        );
        const data = await response.json();

        res.status(200).send({ data });
      } else if (req.method === 'PUT') {
        const wallet = String(req.body.wallet);

        if (!address || !wallet) return res.status(400);

        const response = await fetch(
          `https://phiat.exchange/PhattyWallet?add=${address}&wallet=${wallet}&action=Cancel&tk=fhasilfhiosadfh529038`
        );
        const data = await response.json();

        res.status(200).send({ data });
      }
    } catch (err) {
      res
        .status(500)
        .send({ data: [], error: 'An error occured while trying to process the request' });
    }
  },
  {
    cookieName: 'phatty_auth',
    password: process.env.COOKIE_SECRET as string,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  }
);
