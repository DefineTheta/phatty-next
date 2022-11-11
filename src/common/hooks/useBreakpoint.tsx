import { useEffect, useState } from 'react';

export const Breakpoint = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  '2xl': 5
} as const;

export type Breakpoint = typeof Breakpoint[keyof typeof Breakpoint];

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(Breakpoint.xs);

  const handleResize = () => {
    if (window.innerWidth > 1536) setBreakpoint(Breakpoint['2xl']);
    else if (window.innerWidth > 1280) setBreakpoint(Breakpoint.xl);
    else if (window.innerWidth > 1024) setBreakpoint(Breakpoint.lg);
    else if (window.innerWidth > 768) setBreakpoint(Breakpoint.md);
    else setBreakpoint(Breakpoint.sm);
  };

  const isScreenSizeLargerThan = (screenSize: Breakpoint) => {
    if (breakpoint >= screenSize) return true;
    else return false;
  };

  const isScreenSizeSmallerThan = (screenSize: Breakpoint) => {
    if (breakpoint < screenSize) return true;
    else return false;
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { breakpoint, isScreenSizeLargerThan, isScreenSizeSmallerThan };
};

export default useBreakpoint;
