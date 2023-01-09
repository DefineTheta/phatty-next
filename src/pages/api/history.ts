import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

type TypedApiRouterHandlerArgs<T extends z.ZodTypeAny> = {
  input: z.infer<T>;
};
type TypedApiRouterHandler<T extends z.ZodTypeAny, K extends z.ZodTypeAny> = ({
  input
}: TypedApiRouterHandlerArgs<T>) => Promise<z.infer<K>>;

const withTypedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler<T, K>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const input = inputSchema.parse(req.query);

      res.json(await handler({ input }));
    } catch (err) {
      console.error(err);
    }
  };

const typedFetch = async <T extends z.ZodTypeAny>(
  responseSchema: T,
  fetchPromise: Promise<Response>
): Promise<z.infer<T>> => {
  const promise = await fetchPromise;
  const data = await promise.json();
  const parsed = responseSchema.parse(data);

  return parsed;
};

const TransactionSchema = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.coerce.number(),
  isError: z.string().default('0'),
  functionName: z.string().default(''),
  tokenSymbol: z.string().default('NAN'),
  tokenDecimal: z.coerce.number().default(0),
  timeStamp: z.coerce.number()
});
type Transaction = z.infer<typeof TransactionSchema>;

const TokenSchema = z.object({
  token: z.string(),
  amount: z.number(),
  transaction: z.string()
});
type Token = z.infer<typeof TokenSchema>;

const ParsedTransactioSchema = z.object({
  hash: z.string(),
  type: z.string(),
  chain: z.string(),
  input: z.string(),
  link: z.string(),
  functionName: z.string(),
  tokens: z.array(TokenSchema),
  timeStamp: z.number()
});
type ParsedTransaction = z.infer<typeof ParsedTransactioSchema>;

const TransactionApiResponseSchema = z.object({
  result: z.array(TransactionSchema)
});

const parseTransactionList = (
  list: Transaction[],
  transactionType: string,
  chain: string,
  address: string,
  link: string
) => {
  const parsedList: ParsedTransaction[] = [];

  list.forEach((transaction) => {
    if (transaction.isError === '1') return;

    const parsedTransaction: ParsedTransaction = {
      hash: transaction.hash,
      timeStamp: transaction.timeStamp,
      type: transactionType,
      chain: chain,
      input: '',
      link: `${link}/${transaction.hash}`,
      functionName: '',
      tokens: [
        {
          token: '',
          amount: 0,
          transaction: ''
        }
      ]
    };

    if (transaction.functionName) {
      parsedTransaction.functionName = transaction.functionName.split('(')[0];
    } else if (transaction.to.toLowerCase() === address) {
      parsedTransaction.functionName = 'Receive';
    } else if (transaction.from.toLowerCase() === address) {
      parsedTransaction.functionName = 'Send';
    }

    if (transactionType === 'Transfer') {
      if (transaction.value > 0) {
        parsedTransaction.tokens = [
          {
            token: chain,
            amount: transaction.value / 10 ** 18,
            transaction: parsedTransaction.functionName
          }
        ];
      } else {
        parsedTransaction.tokens = [];
      }
    } else {
      parsedTransaction.tokens = [
        {
          token: transaction.tokenSymbol,
          amount: transaction.value / 10 ** transaction.tokenDecimal,
          transaction: parsedTransaction.functionName
        }
      ];
    }

    return parsedList.push(parsedTransaction);
  });

  return parsedList;
};

const combineArray = (list: ParsedTransaction[], tokensList: ParsedTransaction[]) => {
  const hashMap: { [index: string]: ParsedTransaction } = {};
  const cleanedTokensList: ParsedTransaction[] = [];

  list.forEach((listItem) => {
    hashMap[listItem.hash] = { ...listItem };
  });

  tokensList.forEach((tokenItem) => {
    if (!hashMap.hasOwnProperty(tokenItem.hash)) {
      cleanedTokensList.push(tokenItem);
      return;
    }

    hashMap[tokenItem.hash].tokens.push(tokenItem.tokens[0]);
  });

  return [Object.values(hashMap), cleanedTokensList];
};

export default withTypedApiRoute(
  z.object({ address: z.string() }),
  z.object({ data: z.array(ParsedTransactioSchema) }),
  async ({ input }) => {
    const ethList = await typedFetch(
      TransactionApiResponseSchema,
      fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${input.address}&startblock=15609519&endblock=99999999&page=1&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
      )
    );
    const ethTokens = await typedFetch(
      TransactionApiResponseSchema,
      fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${input.address}&page=1&startblock=15609519&endblock=99999999&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`
      )
    );
    const bscList = await typedFetch(
      TransactionApiResponseSchema,
      fetch(
        `https://api.bscscan.com/api?module=account&action=txlist&address=${input.address}&startblock=20202971&endblock=99999999&page=1&sort=desc&apikey=${process.env.BSCSCAN_API_KEY}`
      )
    );
    const bscTokens = await typedFetch(
      TransactionApiResponseSchema,
      fetch(
        `https://api.bscscan.com/api?module=account&action=tokentx&address=${input.address}&page=1&startblock=20202971&endblock=99999999&page=1&sort=desc&apikey=${process.env.BSCSCAN_API_KEY}`
      )
    );

    const parsedEthList = parseTransactionList(
      ethList.result,
      'Transfer',
      'ETH',
      input.address,
      'https://etherscan.io/tx'
    );
    const parsedEthTokens = parseTransactionList(
      ethTokens.result,
      'ERC20',
      'ETH',
      input.address,
      'https://etherscan.io/tx'
    );
    const parsedBscList = parseTransactionList(
      bscList.result,
      'Transfer',
      'BNB',
      input.address,
      'https://bscscan.com/tx'
    );
    const parsedBscTokens = parseTransactionList(
      bscTokens.result,
      'ERC20',
      'BNB',
      input.address,
      'https://bscscan.com/tx'
    );

    const [combinedEthList, cleanedEthTokensList] = combineArray(parsedEthList, parsedEthTokens);
    const [combinedBscList, cleanedBscTokensList] = combineArray(parsedBscList, parsedBscTokens);

    const combinedList = [
      ...combinedEthList,
      ...cleanedEthTokensList,
      ...combinedBscList,
      ...cleanedBscTokensList
    ];
    combinedList.sort((a, b) => b.timeStamp - a.timeStamp);

    return { data: combinedList };
  }
);
