export const allComponentColors = [
  'primary',
  'secondary',
  'neutral',
  'safe',
  'info',
  'caution',
  'warning',
  'danger',
] as const;

export type ComponentColor = (typeof allComponentColors)[number];

export type ComponentSize = '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export const componentSizes = [
  '2xs',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
] as const satisfies readonly ComponentSize[];
