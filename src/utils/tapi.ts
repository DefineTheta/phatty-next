import { AuthorizationError, NotFoundError } from '@app-src/lib/error';
import { NextApiRequest, NextApiResponse } from 'next';
import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

type TypedApiRouterHandlerArgs<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends boolean
> = {
  query: z.infer<T>;
  body: z.infer<U>;
  token: V extends true ? JWT : null;
};
type TypedApiRouterHandler<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny,
  W extends boolean
> = ({ query, body, token }: TypedApiRouterHandlerArgs<T, U, W>) => Promise<z.infer<V>>;

type ApiRoutes = {
  GET?: ReturnType<typeof typedApiRoute>;
  POST?: ReturnType<typeof typedApiRoute>;
  PUT?: ReturnType<typeof typedApiRoute>;
  PATCH?: ReturnType<typeof typedApiRoute>;
  DELETE?: ReturnType<typeof typedApiRoute>;
};

type ApiRouterSettings = {
  protected: boolean;
};

type TypedApiRouteArgs<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny,
  W extends boolean
> = {
  query?: T;
  body?: U;
  output?: V;
  isProtected: W;
  handler: TypedApiRouterHandler<T, U, V, W>;
};

export const typedApiRoute =
  <T extends z.ZodTypeAny, U extends z.ZodTypeAny, V extends z.ZodTypeAny, W extends boolean>({
    query: querySchema,
    body: bodySchema,
    output: outputSchema,
    isProtected,
    handler
  }: TypedApiRouteArgs<T, U, V, W>) =>
  async (req: NextApiRequest, res: NextApiResponse<z.infer<V>>) => {
    try {
      const query = querySchema ? querySchema.parse(req.query) : undefined;
      const body = bodySchema ? bodySchema.parse(req.body) : undefined;

      const token = await getToken({ req });

      if (outputSchema) {
        const response = outputSchema.parse(handlerResponse);

        return res.json(response);
      } else {
        return res.status(204).end();
      }
    } catch (err) {
      if (err instanceof Error) console.error(err.message);

      switch (true) {
        case err instanceof AuthorizationError:
          return res.status(403).end();
        case err instanceof NotFoundError:
          return res.status(404).end();
      }
    }
  };

type TypedApiRouterHandlerArgs2<T extends z.ZodTypeAny> = {
  input: z.infer<T>;
};
type TypedApiRouterHandler2<T extends z.ZodTypeAny, U extends z.ZodTypeAny> = ({
  input
}: TypedApiRouterHandlerArgs2<T>) => Promise<z.infer<U>>;

export const withTypedApiRoute =
  <T extends z.ZodTypeAny, K extends z.ZodTypeAny>(
    inputSchema: T,
    outputSchema: K,
    handler: TypedApiRouterHandler2<T, K>
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
    {
      GET: getRoute,
      POST: postRoute,
      PUT: putRoute,
      PATCH: patchRoute,
      DELETE: deleteRoute
    }: ApiRoutes,
    settings = defaultApiRouterSettings
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (req.method === 'GET' && getRoute) {
        await getRoute(req, res);
      } else if (req.method === 'POST' && postRoute) {
        await postRoute(req, res);
      } else if (req.method === 'PATCH' && patchRoute) {
        await patchRoute(req, res);
      } else if (req.method === 'DELETE' && deleteRoute) {
        await deleteRoute(req, res);
      }

      return res.end();
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
