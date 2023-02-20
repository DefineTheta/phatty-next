import Web3 from 'web3';
import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
export const web3AddressSchema = z.string().refine((value) => Web3.utils.isAddress(value), {
  message: 'Invalid Web3 address'
});
