import { PriceResponse } from '@app-src/types/api';
import { MetaMaskInpageProvider } from '@metamask/providers';

type MiddlewareData = {
  address: string;
  price: PriceResponse;
  page: number;
};

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

declare module 'http' {
  interface IncomingMessage {
    middleware: MiddlewareData;
  }
}
