import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

type TypedApiRouterHandlerArgs<T extends z.ZodTypeAny> = {
  input: z.infer<T>;
};
type TypedApiRouterHandler<T extends z.ZodTypeAny, K extends z.ZodTypeAny> = ({
  input
}: TypedApiRouterHandlerArgs<T>) => Promise<z.infer<K>>;

type ApiRoutes = {
  GET?: ReturnType<typeof typedApiRoute>;
  POST?: ReturnType<typeof typedApiRoute>;
  PUT?: ReturnType<typeof typedApiRoute>;
};

type ApiRouterSettings = {
  protected: boolean;
};

export const typedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler<T, K>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<z.infer<K>>) => {
    try {
      const input = inputSchema.parse(req.query);
      const response = outputSchema.parse(await handler({ input }));

      res.json(response);
    } catch (err) {
      console.error(err);
    }
  };

export const withTypedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler<T, K>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<z.infer<K>>) => {
    try {
      const input = inputSchema.parse(req.query);
      const response = outputSchema.parse(await handler({ input }));

      res.json(response);
    } catch (err) {
      console.error(err);
    }
  };

const defaultApiRouterSettings: ApiRouterSettings = {
  protected: false
};

export const withProtectedTypedApiRoute =
  (
    { GET: getRoute, POST: postRoute, PUT: putRoute }: ApiRoutes,
    settings = defaultApiRouterSettings
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (settings.protected) {
        const token = await getToken({ req });

        console.log(token);

        if (!token) return res.status(401).end();
      }

      if (req.method === 'GET' && getRoute) {
        await getRoute(req, res);
      } else if (req.method === 'POST' && postRoute) {
        await postRoute(req, res);
      }

      res.end();
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
