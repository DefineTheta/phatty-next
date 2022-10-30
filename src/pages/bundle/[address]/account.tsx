import SearchInput from '@app-src/common/components/input/SearchInput';
import Card from '@app-src/common/components/layout/Card';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { selectBundleAddress, selectBundleAddresses } from '@app-src/store/bundles/selectors';
import { KeyboardEvent, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

const BundleAccountPage = () => {
  const bundleAddress = useSelector(useCallback(selectBundleAddress, []));
  const bundleAddresses = useSelector(useCallback(selectBundleAddresses, []));

  const addressInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} />
      <div className="w-full flex flex-col items-center gap-y-30">
        <div className="w-full flex flex-row justify-center gap-x-20">
          <SearchInput onKeyDown={handleSearch} inputRef={addressInputRef} />
          <button className="py-6 px-24 bg-purple-button rounded-full shadow-md cursor-pointer">
            <span className="text-base font-semibold text-text-300">Add Wallet</span>
          </button>
          <button className="py-6 px-24 bg-purple-button rounded-full shadow-md cursor-pointer">
            <span className="text-base font-semibold text-text-300">
              {bundleAddress ? 'Disconnect' : 'Connect Wallet'}
            </span>
          </button>
        </div>
        <Card>
          {bundleAddresses.slice(1).map((address, index) => (
            <div
              key={index}
              className="py-10 flex flex-row justify-between items-center text-text-200"
            >
              <span className="text-base font-medium tracking-wide">{address}</span>
              <a className="px-10 py-1 text-md font-bold underline underline-offset-2 rounded-full cursor-pointer">
                Remove
              </a>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default BundleAccountPage;
