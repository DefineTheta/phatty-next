import { RefObject, useEffect, useState } from 'react';

type IInputProps = {
  inputRef: RefObject<HTMLInputElement>;
  placeholder?: string;
};

const Input = ({ inputRef, placeholder }: IInputProps) => {
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const input = inputRef.current;

    if (!input) return;

    const invalidEventHandler = (e: Event) => {
      setValidationMessage(input.validationMessage);
    };

    input.addEventListener('invalid', invalidEventHandler);

    return () => input.removeEventListener('invalid', invalidEventHandler);
  }, [inputRef]);

  return (
    <div className="flex w-full flex-col gap-y-6">
      <input
        type="text"
        ref={inputRef}
        className="peer w-full rounded-lg border border-white/20 bg-transparent p-12 text-md transition-colors duration-150 ease-in-out invalid:border-red-600/60 invalid:text-red-600 invalid:text-opacity-80 hover:border-purple-200/60"
        placeholder={placeholder}
      />
      {validationMessage && (
        <span className="text-md text-red-600 peer-valid:hidden">{validationMessage}</span>
      )}
    </div>
  );
};

export default Input;
