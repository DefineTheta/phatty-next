import { typedFetch } from '@app-src/utils/tapi';
import { z } from 'zod';

const BaseIcosaStakeResponse = z.object({
  stakePoints: z.number(),
  minStakeDays: z.number(),
  usdValue: z.number()
});

const HedronIcosaStakeResponse = BaseIcosaStakeResponse.extend({
  stakedHedron: z.number()
});

export type HedronIcosaStakeItem = z.infer<typeof HedronIcosaStakeResponse>;

const IcsaIcosaStakeResponse = BaseIcosaStakeResponse.extend({
  stakedIcsa: z.number()
});

export type IcsaIcosaStakeItem = z.infer<typeof IcsaIcosaStakeResponse>;

const IcosaResponse = z.object({
  data: z.object({
    HEDRON: z.array(HedronIcosaStakeResponse),
    ICSA: z.array(IcsaIcosaStakeResponse)
  }),
  totalValue: z.number()
});

export type IcosaResponse = z.infer<typeof IcosaResponse>;

export const getStakedIcosa = (address: string, fetchOptions?: RequestInit) =>
  typedFetch(IcosaResponse, fetch(`/api/icosa?address=${address}`, fetchOptions));
