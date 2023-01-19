import { PaginatedApiSchema } from '@app-src/schema/api';
import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

const XenTotalSchema = z.object({
  ETH: z.number().optional(),
  BSC: z.number().optional(),
  MATIC: z.number().optional(),
  AVAX: z.number().optional(),
  FTM: z.number().optional(),
  GLMR: z.number().optional(),
  EVMOS: z.number().optional(),
  DOGE: z.number().optional(),
  OKC: z.number().optional(),
  ETHW: z.number().optional(),
  TOTAL: z.number()
});

export type XenTotal = z.infer<typeof XenTotalSchema>;

const XenTotalEnum = XenTotalSchema.keyof();

export type XenTotalEnum = z.infer<typeof XenTotalEnum>;

const XenStakeSchema = z.object({
  balance: z.number(),
  staked: z.number(),
  term: z.number(),
  usdValue: z.number(),
  chain: XenTotalEnum,
  chainImg: z.string()
});

export type XenStake = z.infer<typeof XenStakeSchema>;

const XenMintSchema = z.object({
  term: z.number(),
  rank: z.number(),
  usdValue: z.number(),
  estimatedXen: z.number(),
  chain: XenTotalEnum,
  chainImg: z.string()
});

export type XenMint = z.infer<typeof XenMintSchema>;

export const XenResponse = PaginatedApiSchema.extend({
  data: z.object({
    STAKING: z.object({
      data: z.array(XenStakeSchema),
      totalValue: XenTotalSchema
    }),
    MINTING: z.object({
      data: z.array(XenMintSchema),
      totalValue: XenTotalSchema
    })
  })
});

export type XenResponse = z.infer<typeof XenResponse>;

export const fetchXen = (address: string, page: number, fetchOptions?: RequestInit) =>
  typedFetch(XenResponse, fetch(`/api/xen?address=${address}&page=${page}`, fetchOptions));
