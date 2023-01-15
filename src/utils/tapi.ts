import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

type TypedApiRouterHandlerArgs<T extends z.ZodTypeAny> = {
  input: z.infer<T>;
};
type TypedApiRouterHandler<T extends z.ZodTypeAny, K extends z.ZodTypeAny> = ({
  input
}: TypedApiRouterHandlerArgs<T>) => Promise<z.infer<K>>;

export const withTypedApiRoute =
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

export const typedFetch = async <T extends z.ZodTypeAny>(
  responseSchema: T,
  fetchPromise: Promise<Response>
): Promise<z.infer<T>> => {
  const promise = await fetchPromise;
  const data = await promise.json();
  const parsed = responseSchema.parse(data);

  return parsed;
};
