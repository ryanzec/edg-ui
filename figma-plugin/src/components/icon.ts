import { type GeneratedVariables, getColorVar, getPrimitiveVar } from '../lib/variables';
import { combineAsVariants, createIcon, tintIcon } from '../lib/build-helpers';
import { ALL_ICON_NAMES, type IconName } from '../lib/icons';
import { tokens } from '../lib/tokens';

const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const;
const COLORS = ['inherit', 'muted', 'primary', 'danger'] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];

function sizePxFor(size: Size): number {
  const fontSizePx = tokens.primitives.fontSize[size === 'base' ? 'base' : size];

  if (!fontSizePx) return 16;

  if (size === 'xs') return fontSizePx + 1;
  if (size === 'sm') return fontSizePx + 2;

  return fontSizePx + 3;
}

function colorVarFor(vars: GeneratedVariables, color: Color): Variable | undefined {
  if (color === 'inherit') return getPrimitiveVar(vars, 'color', 'inherit');
  if (color === 'muted') return getColorVar(vars, 'fg-muted');

  return getColorVar(vars, color);
}

function variantName(name: IconName, size: Size, color: Color): string {
  return `Name=${name}, Size=${size}, Color=${color}`;
}

function buildVariant(vars: GeneratedVariables, name: IconName, size: Size, color: Color): ComponentNode {
  const component = figma.createComponent();
  component.name = variantName(name, size, color);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;

  const sizePx = sizePxFor(size);
  const icon = createIcon(name, sizePx);

  if (icon) {
    const colorVariable = colorVarFor(vars, color);

    if (colorVariable) tintIcon(icon, colorVariable);

    component.appendChild(icon);
  }

  return component;
}

export function generateIcon(vars: GeneratedVariables, page: PageNode): ComponentSetNode {
  const components: ComponentNode[] = [];

  for (const name of ALL_ICON_NAMES) {
    for (const size of SIZES) {
      for (const color of COLORS) {
        const component = buildVariant(vars, name, size, color);
        page.appendChild(component);
        components.push(component);
      }
    }
  }

  const set = combineAsVariants(components, 'Icon');
  page.appendChild(set);

  return set;
}
