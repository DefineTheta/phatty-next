import DefaultLayout from '@app-src/common/components/layout/DefaultLayout';
import HomePageModal from '@app-src/modules/modal/HomePageModal';
import { store } from '@app-src/store/store';
import { Analytics } from '@vercel/analytics/react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <HomePageModal />
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
        <Analytics />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
