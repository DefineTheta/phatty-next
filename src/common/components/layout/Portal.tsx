import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type IPortalProps = {
  children: ReactNode;
};

const Portal = ({ children }: IPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (document.querySelector('#portal') as Element).replaceChildren();

    return () => {
      setMounted(false);
    };
  }, []);

  return mounted ? createPortal(children, document.querySelector('#portal') as Element) : null;
};

export default Portal;
