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

/** all available color strength values shared across color-aware components */
export const allColorStrengths = ['strong', 'soft'] as const;

/** the color intensity applied to a component's semantic color; 'soft' swaps strong color tokens for their soft equivalents */
export type ColorStrength = (typeof allColorStrengths)[number];

export type ComponentSize = '2xs' | 'xs' | 'sm' | 'base' | '5xl' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export const componentSizes = [
  '2xs',
  'xs',
  'sm',
  'base',
  '5xl',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
] as const satisfies readonly ComponentSize[];
