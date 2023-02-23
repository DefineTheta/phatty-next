import Input from '@app-src/common/components/input/Input';
import RadioButton from '@app-src/common/components/input/RadioButton';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { updateBundle } from '@app-src/store/bundle/bundleSlice';
import { selectBundle } from '@app-src/store/bundle/selectors';
import { BriefcaseIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Web3 from 'web3';

type IEditBundleModalProps = {
  bundleId: string;
  isVisible: boolean;
  handleClose: () => void;
};

const EditBundleModal = ({ bundleId, isVisible, handleClose }: IEditBundleModalProps) => {
  const dispatch = useAppDispatch();

  const addressInputRef = useRef<HTMLInputElement>(null);

  const bundle = useAppSelector(useCallback(selectBundle(bundleId), [bundleId]));
  const [bundleData, setBundleData] = useState(bundle);

  useEffect(() => {
    setBundleData(bundle);
  }, [bundle]);

  const handleAddressAdd = useCallback(() => {
    if (!addressInputRef.current) return;

    const address = addressInputRef.current.value.trim().toLowerCase();

    if (!address) return;
    if (!Web3.utils.isAddress(address)) {
      addressInputRef.current.setCustomValidity('Please provide a valid address');
      addressInputRef.current.checkValidity();
      return;
    }
    if (bundleData.addresses.find((add) => add === address)) {
      addressInputRef.current.setCustomValidity('Address already in bundle');
      addressInputRef.current.checkValidity();
      return;
    }

    addressInputRef.current.value = '';
    addressInputRef.current.setCustomValidity('');

    setBundleData({
      ...bundleData,
      addresses: [...bundleData.addresses, address]
    });
  }, [bundleData]);

  const handleAddressRemove = useCallback(
    (address: string) => {
      if (!address) return;

      const filteredAddresses = bundleData.addresses.filter((add) => add !== address);

      setBundleData({
        ...bundleData,
        addresses: filteredAddresses
      });
    },
    [bundleData]
  );

  const handleVisibilityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== 'PUBLIC' && value !== 'PRIVATE') return;

      setBundleData({
        ...bundleData,
        visibility: value
      });
    },
    [bundleData]
  );

  const handleSave = useCallback(() => {
    dispatch(updateBundle(bundleData));
  }, [dispatch, bundleData]);

  if (!bundleData) return null;

  return (
    <Modal
      shouldCloseOnOverlayClick
      isOpen={isVisible}
      onRequestClose={handleClose}
      overlayClassName="absolute top-0 left-0 z-50 h-screen w-screen flex flex-row items-center justify-center bg-black/40 focus:"
      className="mx-20 flex w-600 flex-col gap-y-20 rounded-md bg-background-100 px-16 py-20 text-text-200 shadow-xl focus:outline-none md:m-0"
    >
      <div className="flex flex-row items-center gap-x-12 border-b border-white/20 pb-8">
        <BriefcaseIcon className="h-24 w-24" />
        <h1 className="text-lg font-bold text-text-200">{bundleData.name}</h1>
      </div>
      <div className="flex flex-col justify-center gap-y-6">
        <h3 className="text-md font-semibold text-text-200">Search Address</h3>
        <div className="flex flex-row items-start gap-x-12">
          <Input inputRef={addressInputRef} placeholder="0x" />
          <button
            className="mt-2 cursor-pointer rounded-lg bg-purple-600 p-12 text-md font-semibold text-text-100"
            onClick={handleAddressAdd}
          >
            <PlusIcon className="h-20 w-20" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h3 className="text-md font-semibold text-text-200">Addresses</h3>
        {bundleData.addresses.length > 0 ? (
          <div className="flex flex-col gap-y-8">
            {bundleData.addresses.map((address, index) => (
              <div key={index} className="flex flex-row items-center justify-between">
                <div className="text-md">
                  <span className="font-semibold">{`${index + 1}. `}</span>
                  <span>{address}</span>
                </div>
                <button onClick={() => handleAddressRemove(address)}>
                  <TrashIcon className="h-16 w-16" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-md text-text-100/50">No addresses yet...</span>
        )}
      </div>
      <div className="flex flex-col gap-y-6">
        <h3 className="text-md font-semibold text-text-200">Visibility</h3>
        <div className="flex flex-row items-center gap-x-12">
          <RadioButton
            id="public"
            label="Everyone"
            name="visibility"
            value="PUBLIC"
            isChecked={bundleData.visibility === 'PUBLIC'}
            selectHandler={handleVisibilityChange}
          />
          <RadioButton
            id="private"
            label="Only Me"
            name="visibility"
            value="PRIVATE"
            isChecked={bundleData.visibility === 'PRIVATE'}
            selectHandler={handleVisibilityChange}
          />
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-12 border-t border-white/20 pt-12">
        <button
          className="cursor-pointer rounded-lg border border-white/50 px-24 py-12 text-md font-semibold text-text-100"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          className="cursor-pointer rounded-lg bg-purple-600 px-24 py-12 text-md font-semibold text-text-100"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditBundleModal;
