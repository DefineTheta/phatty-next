import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

export const PhiatTransactionsResponse = z.array(
  z.object({
    TimeStamp: z.coerce.string(),
    Token: z.coerce.string(),
    'Token Amount': z.coerce.string(),
    'Token Price': z.coerce.string(),
    'USD Value': z.coerce.string(),
    Tiers: z.coerce.string()
  })
);

export const PhiatPointsResponse = z.array(
  z.object({
    'Phiat Points (normal)': z.coerce.string(),
    'Phiat Points (bonus)': z.coerce.string(),
    'ePhiat Points (bonus)': z.coerce.string(),
    'Phame Points (Bonus)': z.coerce.string()
  })
);

export const PhameTransactionsResponse = z.array(
  z.object({
    TimeStamp: z.coerce.string(),
    Token: z.coerce.string(),
    'Token Amount': z.coerce.string(),
    'Token Price': z.coerce.string(),
    'USD Value': z.coerce.string()
  })
);

export const PhameTiersResponse = z.array(
  z.object({
    MagicM: z.coerce.string(),
    Phomo: z.coerce.string(),
    PoolATier0: z.coerce.string(),
    PoolATier1: z.coerce.string(),
    PoolATier2: z.coerce.string()
  })
);

export const PhamePointsResponse = z.array(
  z.object({
    'Phame Points (Normal)': z.coerce.string(),
    'ePhiat Points (Bonus)': z.coerce.string(),
    'Phame Points (Volume Bonus)': z.coerce.string(),
    'Phame Points (Loyalty Bonus)': z.coerce.string()
  })
);

export const CheckerResponse = z.object({
  phiatTransactions: PhiatTransactionsResponse,
  phiatPoints: PhiatPointsResponse,
  phameTransactions: PhameTransactionsResponse,
  phameTiers: PhameTiersResponse,
  phamePoints: PhamePointsResponse
});

export type CheckerResponse = z.infer<typeof CheckerResponse>;

export const getChecker = (address: string, fetchOptions?: RequestInit) =>
  typedFetch(CheckerResponse, fetch(`/api/checker?address=${address}`, fetchOptions));
