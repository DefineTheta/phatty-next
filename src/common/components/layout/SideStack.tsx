import { Spacing } from '@app-src/common/types/style';
import { getSpacingClass } from '@app-src/common/utils/tailwind';
import { ReactNode, useMemo } from 'react';

export type ISideStackProps = {
  spacing: Spacing;
  children?: ReactNode;
};

const SideStack = ({ spacing, children }: ISideStackProps) => {
  const spacingClass = useMemo(() => getSpacingClass(spacing, 'col'), [spacing]);

  return <div className={`flex flex-row ${spacingClass}`}>{children}</div>;
};

export default SideStack;
