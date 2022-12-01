import DefaultLayout from '@app-src/common/components/layout/DefaultLayout';
import { store } from '@app-src/store/store';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { AppProps } from 'next/app';
import { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleModalClose = useCallback(() => setIsModalVisible(false), []);

  return (
    <Provider store={store}>
      <Modal
        shouldCloseOnOverlayClick
        isOpen={isModalVisible}
        onRequestClose={handleModalClose}
        overlayClassName="absolute top-0 left-0 z-50 h-screen w-screen flex flex-row items-center justify-center bg-black/40 focus:"
        className="mx-20 flex w-600 flex-col gap-y-20 bg-background-100 p-16 pb-30 text-text-200 shadow-xl focus:outline-none md:m-0"
      >
        <div className="flex flex-row justify-between text-center">
          <span className="text-xl font-extrabold tracking-wider">Welcome to Phatty demo!</span>
          <button className="cursor-pointer" onClick={handleModalClose}>
            <XMarkIcon className="h-24 w-24 text-text-300" />
          </button>
        </div>
        <p className="text-base">
          We have built this as a proof of concept for you to better understand what we will bring
          to Phatty. This is not by any means a final product or an attempt at one. It only supports
          a very limited number of protocols and chains. It is not optimized for loading speed and
          may contain bugs.
        </p>
        <p className="text-base">
          You should only use it for testing purposes as the information might be wrong. Experiment
          and let us know what you think.
        </p>
      </Modal>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </Provider>
  );
}

export default MyApp;
