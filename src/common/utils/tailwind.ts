import { Spacing, SpacingEnum } from '@app-src/common/types/style';

export const getSpacingClass = (spacing: Spacing, direction: 'row' | 'col') => {
  switch (spacing) {
    case SpacingEnum.xsmall:
      return `gap-${direction === 'row' ? 'y' : 'x'}-6`;
    case SpacingEnum.small:
      return `gap-${direction === 'row' ? 'y' : 'x'}-12`;
    case SpacingEnum.medium:
      return `gap-${direction === 'row' ? 'y' : 'x'}-18`;
    case SpacingEnum.large:
      return `gap-${direction === 'row' ? 'y' : 'x'}-24`;
    default:
      return `gap-${direction === 'row' ? 'y' : 'x'}-6`;
  }
};
