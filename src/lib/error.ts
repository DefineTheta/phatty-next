export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class MetamaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetamaskError';
  }
}

const HttpErrorCodeEnum = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const;

type HttpErrorCode = typeof HttpErrorCodeEnum[keyof typeof HttpErrorCodeEnum];

export class HttpError extends Error {
  constructor(type: HttpErrorCode, message: string) {
    super(message);
    this.name = type;
  }
}
