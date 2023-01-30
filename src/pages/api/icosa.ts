import { IcosaResponse } from '@app-src/server/icosa';
import { API_PRICE_URL, icsaContract } from '@app-src/services/web3';
import { PriceResponse } from '@app-src/types/api';
import { withTypedApiRoute } from '@app-src/utils/tapi';
import { z } from 'zod';

const IcosaStakeSchema = z.object({
  stakeStart: z.coerce.number(),
  capitalAdded: z.coerce.number(),
  stakePoints: z.coerce.number(),
  isActive: z.boolean(),
  payoutPreCapitalAddIcsa: z.coerce.number(),
  payoutPreCapitalAddHdrn: z.coerce.number(),
  stakeAmount: z.coerce.number(),
  minStakeLength: z.coerce.number()
});

export default withTypedApiRoute(
  z.object({ address: z.string() }),
  IcosaResponse,
  async ({ input }) => {
    const priceResponse = await fetch(API_PRICE_URL);

    const price: PriceResponse = await priceResponse.json();

    const data = await Promise.all([
      icsaContract.methods.hdrnStakes(input.address).call(),
      icsaContract.methods.icsaStakes(input.address).call()
    ]);

    const hedronStake = IcosaStakeSchema.parse(data[0]);
    const icsaStake = IcosaStakeSchema.parse(data[1]);

    const hedronStakeValue = price['HDRN'] * (hedronStake.stakeAmount / 10e8);
    const icsaStakeValue = price['ICSA'] * (icsaStake.stakeAmount / 10e8);

    const resObj = {
      data: {
        HEDRON: [
          {
            stakedHedron: hedronStake.stakeAmount / 10e8,
            stakePoints: hedronStake.stakePoints,
            minStakeDays: hedronStake.minStakeLength,
            usdValue: hedronStakeValue
          }
        ],
        ICSA: [
          {
            stakedIcsa: icsaStake.stakeAmount / 10e8,
            stakePoints: icsaStake.stakePoints,
            minStakeDays: icsaStake.minStakeLength,
            usdValue: icsaStakeValue
          }
        ]
      },
      totalValue: hedronStakeValue + icsaStakeValue
    };

    return resObj;
  }
);
