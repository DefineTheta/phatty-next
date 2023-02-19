import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

type TypedApiRouterHandlerArgs<T extends z.ZodTypeAny> = {
  input: z.infer<T>;
  method?: string;
};
type TypedApiRouterHandler<T extends z.ZodTypeAny, K extends z.ZodTypeAny> = ({
  input,
  method
}: TypedApiRouterHandlerArgs<T>) => Promise<z.infer<K>>;

export const withTypedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler<T, K>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<z.infer<K>>) => {
    try {
      const input = inputSchema.parse(req.query);
      const response = outputSchema.parse(await handler({ input, method: req.method }));

      res.json(response);
    } catch (err) {
      console.error(err);
    }
  };

export const withProtectedTypedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler<T, K>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<z.infer<K>>) => {
    try {
      const token = await getToken({ req });

      if (token) {
        const input = inputSchema.parse(req.query);
        const response = outputSchema.parse(await handler({ input, method: req.method }));

        res.json(response);
      } else {
        res.status(401).end();
      }
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
