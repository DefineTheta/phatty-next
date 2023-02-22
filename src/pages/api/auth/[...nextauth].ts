import { HttpError } from '@app-src/lib/error';
import prisma from '@app-src/lib/prisma';
import { decryptAddress } from '@app-src/services/web3';
import { User } from '@prisma/client';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextApiRequest, NextApiResponse } from 'next/types';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method);
  console.log(req.url);

  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        id: 'metamask',
        credentials: {
          address: {
            label: 'Address',
            type: 'text',
            placeholder: '0x'
          },
          sign: {
            label: 'Sign',
            type: 'text',
            placeholder: ''
          }
        },
        authorize: async (credentials, req) => {
          try {
            console.error(credentials);

            if (!credentials) return null;

            const date = new Date();
            const dateStr = date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100;
            const decryptedAddress = decryptAddress(
              dateStr + credentials.address.toLowerCase(),
              credentials.sign
            ).toLowerCase();

            if (credentials.address === decryptedAddress) {
              let user = await prisma.user.findFirst({
                where: {
                  connectedAddress: decryptedAddress
                }
              });

              if (!user) {
                user = await prisma.user.create({
                  data: {
                    connectedAddress: decryptedAddress
                  }
                });
              }

              return user;
            }

            throw new HttpError('UNAUTHORIZED', 'Credentials and metamask signature do not match');
          } catch (error) {
            if (error instanceof Error) console.error(error.message);

            return null;
          }
        }
      })
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
      strategy: 'jwt'
    },
    callbacks: {
      jwt: async ({ token, user }) => {
        const newUser = user as User;

        if (user) {
          return {
            ...token,
            user: newUser
          };
        }

        return token;
      }
    }
  });
}
