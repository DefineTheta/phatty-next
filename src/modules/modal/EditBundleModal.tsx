import Input from '@app-src/common/components/input/Input';
import RadioButton from '@app-src/common/components/input/RadioButton';
import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import { deleteBundle, updateBundle } from '@app-src/store/bundle/bundleSlice';
import { selectBundle } from '@app-src/store/bundle/selectors';
import { BriefcaseIcon, LinkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import Web3 from 'web3';

type IEditBundleModalProps = {
  bundleId: string;
  isVisible: boolean;
  handleClose: () => void;
};

const EditBundleModal = ({ bundleId, isVisible, handleClose }: IEditBundleModalProps) => {
  const dispatch = useAppDispatch();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const bundle = useAppSelector(useCallback(selectBundle(bundleId), [bundleId]));
  const [bundleData, setBundleData] = useState(bundle);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!nameInputRef.current) return;

    const data: typeof bundleData = {
      ...bundleData,
      name: nameInputRef.current.value
    };

    setBundleData(data);

    setIsSaving(true);
    toast
      .promise(dispatch(updateBundle(data)), {
        loading: <span className="text-md font-bold">Saving...</span>,
        success: <span className="text-md font-bold">Bundle saved!</span>,
        error: <span className="text-md font-bold">Could not save</span>
      })
      .then(() => {
        setIsSaving(false);
      });
  }, [dispatch, bundleData, nameInputRef]);

  const handleDelete = useCallback(() => {
    toast.promise(dispatch(deleteBundle(bundleId)), {
      loading: <span className="text-md font-bold">Deleting...</span>,
      success: <span className="text-md font-bold">Bundle deleted!</span>,
      error: <span className="text-md font-bold">Could not deleted</span>
    });
  }, [dispatch, bundleId]);

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
        <h1 className="text-lg font-bold text-text-200">Edit Bundle</h1>
      </div>
      <div className="flex flex-col justify-center gap-y-6">
        <div className="flex flex-row items-center gap-x-4">
          <h3 className="text-md font-semibold text-text-200">Bundle Name</h3>
        </div>
        <Input inputRef={nameInputRef} placeholder={bundleData.name} />
      </div>
      <div className="flex flex-col justify-center gap-y-6">
        <div className="flex flex-row items-center gap-x-4">
          <h3 className="text-md font-semibold text-text-200">Search Address</h3>
        </div>
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
      <div className="flex flex-row items-center justify-between border-t border-white/20 pt-12">
        <div className="flex flex-row items-center gap-x-12">
          <button className="flex flex-row items-center gap-x-6 underline-offset-4 hover:underline">
            <LinkIcon className="h-16 w-16" />
            <span className="text-md text-text-200">Copy Link</span>
          </button>
          <button
            className="flex flex-row items-center gap-x-6 decoration-red-600 underline-offset-4 hover:underline"
            onClick={handleDelete}
          >
            <TrashIcon className="h-16 w-16 text-red-600" />
            <span className="text-md text-red-600/80">Delete Bundle</span>
          </button>
        </div>
        <div className="flex flex-row justify-end gap-x-12">
          <button
            className="cursor-pointer rounded-lg border border-white/50 px-24 py-12 text-md font-semibold text-text-100"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="flex cursor-pointer flex-row items-center gap-x-6 rounded-lg bg-purple-600 px-24 py-12 text-md font-semibold text-text-100"
            onClick={handleSave}
          >
            {isSaving && (
              <svg
                aria-hidden="true"
                className="mr-2 inline h-16 w-16 animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBundleModal;
