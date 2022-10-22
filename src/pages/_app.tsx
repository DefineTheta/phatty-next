import DefaultLayout from '@app-src/common/components/layout/DefaultLayout';
import { store } from '@app-src/store/store';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </Provider>
  );
}

export default MyApp;
