import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    decryptedAddress: string;
  }
}
