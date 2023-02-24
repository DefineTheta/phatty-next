import { HttpError, HttpErrorCodeEnum } from '@app-src/lib/error';
import { getToken, JWT } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

type ApiRoutes = {
  GET?: ReturnType<typeof typedApiRoute>;
  POST?: ReturnType<typeof typedApiRoute>;
  PUT?: ReturnType<typeof typedApiRoute>;
  PATCH?: ReturnType<typeof typedApiRoute>;
  DELETE?: ReturnType<typeof typedApiRoute>;
};

type RouteHandler<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny,
  W extends boolean
> = ({
  query,
  body,
  token
}: {
  query: z.infer<T>;
  body: z.infer<U>;
  token: W extends true ? JWT : null;
}) => Promise<z.infer<V>>;

type RouteArgs<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny,
  W extends boolean
> = {
  query?: T;
  body?: U;
  output?: V;
  isProtected: W;
  handler: RouteHandler<T, U, V, W>;
};

type NextApiHandler<T extends z.ZodTypeAny> = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse>;

export function typedApiRoute<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny
>({ query, body, output, isProtected, handler }: RouteArgs<T, U, V, false>): NextApiHandler<V>;
export function typedApiRoute<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny
>({ query, body, output, isProtected, handler }: RouteArgs<T, U, V, true>): NextApiHandler<V>;
export function typedApiRoute<
  T extends z.ZodTypeAny,
  U extends z.ZodTypeAny,
  V extends z.ZodTypeAny
>({
  query: querySchema,
  body: bodySchema,
  output: outputSchema,
  isProtected,
  handler
}: RouteArgs<T, U, V, boolean>): NextApiHandler<V> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const query = querySchema ? querySchema.parse(req.query) : undefined;
      const body = bodySchema ? bodySchema.parse(await JSON.parse(req.body)) : undefined;
      const token = await getToken({ req });

      if (isProtected && !token) throw new HttpError('UNAUTHORIZED', 'Unauthenticated user');

      const handlerResponse = await handler({ query, body, token });

      if (outputSchema) {
        const response = outputSchema.parse(handlerResponse);
        return res.json(response);
      } else {
        return res.status(204).end();
      }
    } catch (err) {
      if (err instanceof Error) console.error(err.message);

      if (err instanceof HttpError) {
        switch (err.name) {
          case HttpErrorCodeEnum.UNAUTHORIZED:
            return res.status(401).end();
          case HttpErrorCodeEnum.FORBIDDEN:
            return res.status(403).end();
          case HttpErrorCodeEnum.NOT_FOUND:
            return res.status(404).end();
          case HttpErrorCodeEnum.INTERNAL_SERVER_ERROR:
            return res.status(500).end();
        }
      }

      return res.status(500).end();
    }
  };
}

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

export const withProtectedTypedApiRoute =
  ({
    GET: getRoute,
    POST: postRoute,
    PUT: putRoute,
    PATCH: patchRoute,
    DELETE: deleteRoute
  }: ApiRoutes) =>
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

  switch (promise.status) {
    case 401:
      throw new HttpError('UNAUTHORIZED', 'User is unauthorized to make this request');
    case 403:
      throw new HttpError('FORBIDDEN', 'User is forbiden to make this request');
    case 404:
      throw new HttpError('NOT_FOUND', 'Requested resource not found');
    case 500:
      throw new HttpError('INTERNAL_SERVER_ERROR', 'Unexpected internal server error');
  }

  if (promise.status === 204) return;

  const data = await promise.json();
  const parsed = responseSchema.parse(data);

  return parsed;
};

export type TReturnType<TFetch extends (...args: any) => any> = Awaited<ReturnType<TFetch>>;
