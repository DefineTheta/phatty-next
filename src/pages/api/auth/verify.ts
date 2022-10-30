import { decryptAddress } from '@app-src/services/web3';
import { AuthResponse } from '@app-src/types/api';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
    if (req.method === 'GET') {
      const { address, sign } = req.query;

      if (!address || !sign) return res.status(400);

      const date = new Date();
      const dateStr = date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100;
      const decryptedAddress = decryptAddress(
        dateStr + (address as string).toLowerCase(),
        sign as string
      ).toLowerCase();

      if (decryptedAddress === (address as string)) {
        req.session.decryptedAddress = decryptedAddress;
        await req.session.save();

        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    } else if (req.method === 'DELETE') {
      try {
        req.session.destroy();

        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ success: false });
      }
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
