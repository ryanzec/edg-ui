import { type GeneratedVariables, getColorVar, getPrimitiveVar } from '../lib/variables';
import { combineAsVariants, createIcon, tintIcon } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

const SIZES = ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
const COLORS = [
  'inherit',
  'muted',
  'faint',
  'primary',
  'secondary',
  'neutral',
  'safe',
  'info',
  'caution',
  'warning',
  'danger',
] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];

function sizePxFor(size: Size): number {
  const fontSizePx = tokens.primitives.fontSize[size === 'base' ? 'base' : size];

  if (!fontSizePx) return 16;

  // mirrors the css: `--icon-size: calc(var(--font-size-base) + 0.1875rem)` -> +3px (with small adjustments per size)
  if (size === '2xs' || size === 'xs') return fontSizePx + 1;
  if (size === 'sm') return fontSizePx + 2;
  if (size === '4xl' || size === '5xl') return fontSizePx + 4;

  return fontSizePx + 3;
}

function colorVarFor(vars: GeneratedVariables, color: Color): Variable | undefined {
  if (color === 'inherit') return getPrimitiveVar(vars, 'color', 'inherit');
  if (color === 'muted') return getColorVar(vars, 'fg-muted');
  if (color === 'faint') return getColorVar(vars, 'fg-faint');

  return getColorVar(vars, color);
}

function variantName(size: Size, color: Color): string {
  return `Size=${size}, Color=${color}`;
}

function buildVariant(vars: GeneratedVariables, size: Size, color: Color): ComponentNode {
  const component = figma.createComponent();
  component.name = variantName(size, color);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;

  const sizePx = sizePxFor(size);
  const icon = createIcon('loader', sizePx);

  if (icon) {
    const colorVariable = colorVarFor(vars, color);

    if (colorVariable) tintIcon(icon, colorVariable);

    component.appendChild(icon);
  }

  return component;
}

export function generateLoadingSpinner(vars: GeneratedVariables, page: PageNode): ComponentSetNode {
  const components: ComponentNode[] = [];

  for (const size of SIZES) {
    for (const color of COLORS) {
      const component = buildVariant(vars, size, color);
      page.appendChild(component);
      components.push(component);
    }
  }

  const set = combineAsVariants(components, 'Loading Spinner');
  page.appendChild(set);

  return set;
}
