import SearchInput from '@app-src/common/components/input/SearchInput';
import Card from '@app-src/common/components/layout/Card';
import Container from '@app-src/common/components/layout/Container';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import BundleHeader from '@app-src/modules/bundle/components/BundleHeader';
import { addAddressToBundle, removeAddressFromBundle } from '@app-src/store/bundles/bundleSlice';
import { selectBundleAddress, selectBundleAddresses } from '@app-src/store/bundles/selectors';
import { KeyboardEvent, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

const BundleAccountPage = () => {
  const dispatch = useAppDispatch();

  const bundleAddress = useSelector(useCallback(selectBundleAddress, []));
  const bundleAddresses = useSelector(useCallback(selectBundleAddresses, []));

  const addressInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  }, []);

  const handleAddButton = useCallback(() => {
    const address = addressInputRef.current?.value.toLowerCase().trim() || '';
    if (!address || !addressInputRef.current) return;

    addressInputRef.current.value = '';

    dispatch(addAddressToBundle(address));
  }, [addressInputRef]);

  const handleRemoveButton = useCallback(
    (address: string) => {
      if (!address) return;

      dispatch(removeAddressFromBundle(address));
    },
    [addressInputRef]
  );

  return (
    <div className="flex flex-col gap-y-24">
      <BundleHeader address={bundleAddress} currentChains={[]} />
      <div className="flex w-full justify-center">
        <Container>
          <div className="flex w-full flex-col items-center gap-y-30">
            <div className="flex w-full flex-row justify-center gap-x-20">
              <SearchInput onKeyDown={handleSearch} inputRef={addressInputRef} />
              <button
                className="cursor-pointer rounded-full bg-purple-button py-6 px-24 shadow-md"
                onClick={handleAddButton}
              >
                <span className="text-base font-semibold text-text-300">Add Wallet</span>
              </button>
              <button className="cursor-pointer rounded-full bg-purple-button py-6 px-24 shadow-md">
                <span className="text-base font-semibold text-text-300">
                  {bundleAddress ? 'Disconnect' : 'Connect Wallet'}
                </span>
              </button>
            </div>
            <Card>
              {bundleAddresses.slice(1).map((address, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between py-10 text-text-200"
                >
                  <span className="text-base font-medium tracking-wide">{address}</span>
                  <a
                    className="cursor-pointer rounded-full px-10 py-1 text-md font-bold underline underline-offset-2"
                    onClick={() => handleRemoveButton(address)}
                  >
                    Remove
                  </a>
                </div>
              ))}
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BundleAccountPage;
