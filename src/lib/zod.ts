import Web3 from 'web3';
import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
export const web3AddressSchema = z.string().transform((value, ctx) => {
  const valueLowerCase = value.toLocaleLowerCase();

  if (!Web3.utils.isAddress(valueLowerCase)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid Web3 address'
    });

    return z.NEVER;
  }

  return valueLowerCase;
});
