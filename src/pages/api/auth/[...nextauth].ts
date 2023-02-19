import { decryptAddress } from '@app-src/services/web3';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
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
      authorize: async (credentials) => {
        console.log(credentials);

        if (!credentials) return null;

        const date = new Date();
        const dateStr = date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100;
        const decryptedAddress = decryptAddress(
          dateStr + credentials.address.toLowerCase(),
          credentials.sign
        ).toLowerCase();

        if (credentials.address === decryptedAddress) {
          return {
            id: 'asdsa'
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    }
  }
});
