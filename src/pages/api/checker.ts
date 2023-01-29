import { CheckerResponse } from '@app-src/server/checker';
import { withTypedApiRoute } from '@app-src/utils/tapi';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const PhiatTransactionsSchema = z.array(
  z.object({
    Txhash: z.coerce.string(),
    Date: z.coerce.string(),
    From: z.coerce.string(),
    Token: z.coerce.string(),
    'Token Amount': z.coerce.string(),
    'Token Price': z.coerce.string(),
    'USD Value': z.coerce.string(),
    Tiers: z.coerce.string()
  })
);

const PhiatPointsSchema = z.array(
  z.object({
    From: z.coerce.string(),
    'Phiat Points (normal)': z.coerce.string(),
    'Phiat Points (bonus)': z.coerce.string(),
    'ePhiat Points (bonus)': z.coerce.string(),
    'Phame Points (Bonus)': z.coerce.string()
  })
);

const PhameTransactionsSchema = z.array(
  z.object({
    Txhash: z.coerce.string(),
    DateTime: z.coerce.string(),
    From: z.coerce.string(),
    Token: z.coerce.string(),
    'Token Amount': z.coerce.string(),
    'Token Price': z.coerce.string(),
    MagicM: z.coerce.string(),
    'USD Value': z.coerce.string(),
    Phomo: z.coerce.string(),
    PoolATier0: z.coerce.string(),
    PoolATier1: z.coerce.string(),
    PoolATier2: z.coerce.string()
  })
);

const PhamePointsSchema = z.array(
  z.object({
    From: z.coerce.string(),
    'Phame Points (Normal)': z.coerce.string(),
    'ePhiat Points (Bonus)': z.coerce.string(),
    'Phame Points (Volume Bonus)': z.coerce.string()
  })
);

export default withTypedApiRoute(
  z.object({ address: z.string() }),
  CheckerResponse,
  async ({ input }) => {
    const jsonDirectory = path.join(process.cwd(), 'json');
    const phiatOnePromise = fs.readFile(jsonDirectory + '/phiatOne.json', 'utf8');
    const phiatTwoPromise = fs.readFile(jsonDirectory + '/phiatTwo.json', 'utf8');
    const phameOnePromise = fs.readFile(jsonDirectory + '/phameOne.json', 'utf8');
    const phameTwoPromise = fs.readFile(jsonDirectory + '/phameTwo.json', 'utf8');

    const [phiatOne, phiatTwo, phameOne, phameTwo] = await Promise.all([
      phiatOnePromise,
      phiatTwoPromise,
      phameOnePromise,
      phameTwoPromise
    ]);
    const [phiatOneContents, phiatTwoContents, phameOneContents, phameTwoContents] =
      await Promise.all([
        JSON.parse(phiatOne),
        JSON.parse(phiatTwo),
        JSON.parse(phameOne),
        JSON.parse(phameTwo)
      ]);

    const [phiatTransactions, phiatPoints, phameTransactions, phamePoints] = await Promise.all([
      PhiatTransactionsSchema.parseAsync(phiatOneContents),
      PhiatPointsSchema.parseAsync(phiatTwoContents),
      PhameTransactionsSchema.parseAsync(phameOneContents),
      PhamePointsSchema.parseAsync(phameTwoContents)
    ]);

    const filteredPhiatTransactions = phiatTransactions.filter(
      (transaction) => transaction.From.toLowerCase() === input.address.toLowerCase()
    );
    const filteredPhiatPoints = phiatPoints.filter(
      (transaction) => transaction.From.toLowerCase() === input.address.toLowerCase()
    );
    const filteredPhameTransactions = phameTransactions.filter(
      (transaction) => transaction.From.toLowerCase() === input.address.toLowerCase()
    );
    const filteredPhamePoints = phamePoints.filter(
      (transaction) => transaction.From.toLowerCase() === input.address.toLowerCase()
    );

    const resObj = {
      phiatTransactions: filteredPhiatTransactions,
      phiatPoints: filteredPhiatPoints,
      phameTransactions: filteredPhameTransactions,
      phameTiers: filteredPhameTransactions,
      phamePoints: filteredPhamePoints
    };

    return resObj;
  }
);
