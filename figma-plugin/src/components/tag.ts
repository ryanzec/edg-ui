import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createIcon, createText, tintIcon, variableBoundFill } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

const SIZES = ['xs', 'sm', 'base'] as const;
const COLORS = ['primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'] as const;
const VARIANTS = ['strong', 'soft'] as const;
const REMOVABLES = ['no', 'yes'] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];
type VariantName = (typeof VARIANTS)[number];
type Removable = (typeof REMOVABLES)[number];

type SizeTokens = {
  paddingBlock: number;
  paddingInline: number;
  fontSize: number;
  gap: number;
  removeIconSize: number;
};

function sizeTokensFor(size: Size): SizeTokens {
  if (size === 'xs') {
    return {
      paddingBlock: tokens.primitives.spacing['1'],
      paddingInline: tokens.primitives.spacing['1_5'],
      fontSize: tokens.primitives.fontSize.xs,
      gap: tokens.primitives.spacing['1'],
      removeIconSize: 10,
    };
  }

  if (size === 'sm') {
    return {
      paddingBlock: tokens.primitives.spacing['1'],
      paddingInline: tokens.primitives.spacing['2'],
      fontSize: tokens.primitives.fontSize.sm,
      gap: tokens.primitives.spacing['1'],
      removeIconSize: 10,
    };
  }

  return {
    paddingBlock: tokens.primitives.spacing['1'],
    paddingInline: tokens.primitives.spacing['2_5'],
    fontSize: tokens.primitives.fontSize.base,
    gap: tokens.primitives.spacing['1_5'],
    removeIconSize: 12,
  };
}

type TagPalette = { bg: string; fg: string; border: string };

function paletteFor(color: Color, variant: VariantName): TagPalette {
  if (variant === 'strong') {
    return { bg: color, fg: `${color}-on`, border: color };
  }

  return {
    bg: `${color}-soft`,
    fg: color === 'neutral' ? 'fg' : color,
    border: `${color}-soft`,
  };
}

function variantName(size: Size, color: Color, variant: VariantName, removable: Removable): string {
  return `Size=${size}, Color=${color}, Variant=${variant}, Removable=${removable}`;
}

async function buildVariant(
  vars: GeneratedVariables,
  size: Size,
  color: Color,
  variant: VariantName,
  removable: Removable
): Promise<ComponentNode> {
  const sizeTokens = sizeTokensFor(size);
  const palette = paletteFor(color, variant);

  const component = figma.createComponent();
  component.name = variantName(size, color, variant, removable);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingTop = sizeTokens.paddingBlock;
  component.paddingBottom = sizeTokens.paddingBlock;
  component.paddingLeft = sizeTokens.paddingInline;
  component.paddingRight = sizeTokens.paddingInline;
  component.itemSpacing = sizeTokens.gap;
  component.cornerRadius = 999;
  component.strokeAlign = 'INSIDE';
  component.strokeWeight = tokens.primitives.borderWidth.base;
  component.clipsContent = false;

  const bgVar = getColorVar(vars, palette.bg);
  const fgVar = palette.fg === 'fg' ? getColorVar(vars, 'fg') : getColorVar(vars, palette.fg);
  const borderVar = getColorVar(vars, palette.border);

  if (bgVar) component.fills = [variableBoundFill(bgVar)];
  if (borderVar) component.strokes = [variableBoundFill(borderVar)];

  const labelText = await createText({
    text: 'Tag',
    fontSizePx: sizeTokens.fontSize,
    weight: tokens.primitives.fontWeight.medium,
    colorVar: fgVar,
    lineHeight: tokens.primitives.lineHeight.none,
  });
  component.appendChild(labelText);

  if (removable === 'yes') {
    const removeIcon = createIcon('x', sizeTokens.removeIconSize);

    if (removeIcon) {
      if (fgVar) tintIcon(removeIcon, fgVar);

      component.appendChild(removeIcon);
    }
  }

  return component;
}

export async function generateTag(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
  const components: ComponentNode[] = [];

  for (const size of SIZES) {
    for (const color of COLORS) {
      for (const variant of VARIANTS) {
        for (const removable of REMOVABLES) {
          const component = await buildVariant(vars, size, color, variant, removable);
          page.appendChild(component);
          components.push(component);
        }
      }
    }
  }

  const set = combineAsVariants(components, 'Tag');
  page.appendChild(set);

  return set;
}
