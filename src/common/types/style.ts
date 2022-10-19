export enum SpacingEnum {
  'xsmall' = 'xsmall',
  'small' = 'small',
  'medium' = 'medium',
  'large' = 'large'
}

export type Spacing = keyof typeof SpacingEnum;
