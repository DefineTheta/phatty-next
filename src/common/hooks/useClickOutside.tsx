import { useCallback, useEffect, useRef } from 'react';

const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  });

  return ref;
};

export default useClickOutside;
