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
  z.object({}),
  async ({ input }) => {
    const priceResponse = await fetch(API_PRICE_URL);

    const price: PriceResponse = await priceResponse.json();

    const hedronStake = IcosaStakeSchema.parse(
      await icsaContract.methods.hdrnStakes(input.address).call()
    );
    const icsaStake = IcosaStakeSchema.parse(
      await icsaContract.methods.icsaStakes(input.address).call()
    );

    const resObj = {
      hedron: {
        stakedHedron: hedronStake.stakeAmount / 10e8,
        stakePoints: hedronStake.stakePoints,
        minStakeDays: hedronStake.minStakeLength,
        usdValue: price['HDRN'] * (hedronStake.stakeAmount / 10e8)
      },
      icsa: {
        stakedIcsa: icsaStake.stakeAmount / 10e8,
        stakePoints: icsaStake.stakePoints,
        minStakeDays: icsaStake.minStakeLength,
        usdValue: price['ICSA'] * (icsaStake.stakeAmount / 10e8)
      }
    };

    return resObj;
  }
);
