import { useEffect, useState } from 'react';

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('xs');

  const handleResize = () => {
    if (window.innerWidth > 1536) setBreakpoint('2xl');
    else if (window.innerWidth > 1280) setBreakpoint('xl');
    else if (window.innerWidth > 1024) setBreakpoint('lg');
    else if (window.innerWidth > 768) setBreakpoint('md');
    else if (window.innerWidth > 640) setBreakpoint('sm');
    else setBreakpoint('xs');
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
