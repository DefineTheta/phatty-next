import { ReactNode } from 'react';

type IModalProps = {
  children: ReactNode;
  isVisible: boolean;
  onClickOutside: () => void;
};

const Modal = ({ children, isVisible, onClickOutside }: IModalProps) => {
  return (
    <div
      className={`absolute top-0 left-0 z-50 h-screen w-screen flex-row items-center justify-center bg-black/40 ${
        isVisible ? 'flex' : 'hidden'
      }`}
      onClick={onClickOutside}
    >
      {children}
    </div>
  );
};

export default Modal;
