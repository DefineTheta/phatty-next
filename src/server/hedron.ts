import { z } from 'zod';

const HedronItem = z.object({
  stakeType: z.enum(['Tokenized', 'Instanced']),
  hexStaked: z.number(),
  tShares: z.number(),
  hedronMintable: z.number(),
  servedDays: z.number(),
  usdValue: z.number()
});

const HedronChainData = z.object({
  data: z.array(HedronItem),
  totalValue: z.number()
});

export const HedronResponse = z.object({
  data: z.object({
    ETH: HedronChainData,
    TPLS: HedronChainData
  })
});

export type HedronResponse = z.infer<typeof HedronResponse>;
