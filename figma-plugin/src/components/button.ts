import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createText, variableBoundFill } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

const SIZES = ['sm', 'base', 'lg'] as const;
const COLORS = ['primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'] as const;
const COLOR_AWARE_VARIANTS = ['filled', 'soft', 'ghost', 'text'] as const;
const STATES = ['default', 'hover', 'focus', 'active', 'disabled'] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];
type ColorAwareVariant = (typeof COLOR_AWARE_VARIANTS)[number];
type AnyVariant = ColorAwareVariant | 'plain';
type State = (typeof STATES)[number];

type SizeTokens = {
  paddingY: number;
  paddingX: number;
  gap: number;
  fontSize: number;
};

function sizeTokensFor(size: Size): SizeTokens {
  if (size === 'sm') {
    return {
      paddingY: tokens.primitives.spacing['1'],
      paddingX: tokens.primitives.spacing['1'],
      gap: tokens.primitives.spacing['1'],
      fontSize: tokens.primitives.fontSize.sm,
    };
  }

  if (size === 'lg') {
    return {
      paddingY: tokens.primitives.spacing['2'],
      paddingX: tokens.primitives.spacing['4'],
      gap: tokens.primitives.spacing['2'],
      fontSize: tokens.primitives.fontSize.xl,
    };
  }

  return {
    paddingY: tokens.primitives.spacing['1'],
    paddingX: tokens.primitives.spacing['2'],
    gap: tokens.primitives.spacing['1'],
    fontSize: tokens.primitives.fontSize.base,
  };
}

type ButtonPalette = {
  bg: string | 'transparent';
  fg: string;
  border: string | 'transparent';
};

/** for a (color, variant, state) combination, return the codebase color-primitive names to apply */
function paletteFor(color: Color, variant: ColorAwareVariant, state: State): ButtonPalette {
  if (variant === 'filled') {
    if (state === 'default' || state === 'disabled') {
      return { bg: color, fg: `${color}-on`, border: color };
    }

    if (state === 'hover' || state === 'focus') {
      return { bg: `${color}-hover`, fg: `${color}-on`, border: `${color}-hover` };
    }

    return { bg: `${color}-active`, fg: `${color}-on`, border: `${color}-active` };
  }

  if (variant === 'soft') {
    if (state === 'default' || state === 'disabled') {
      return { bg: `${color}-soft`, fg: 'fg', border: `${color}-soft` };
    }

    if (state === 'hover' || state === 'focus') {
      return { bg: `${color}-soft-hover`, fg: 'fg', border: `${color}-soft-hover` };
    }

    return { bg: `${color}-soft-active`, fg: 'fg', border: `${color}-soft-active` };
  }

  if (variant === 'ghost') {
    if (state === 'default' || state === 'disabled') {
      return { bg: 'transparent', fg: color, border: 'transparent' };
    }

    if (state === 'hover' || state === 'focus') {
      return { bg: `${color}-hover`, fg: `${color}-on`, border: `${color}-hover` };
    }

    return { bg: `${color}-active`, fg: `${color}-on`, border: `${color}-active` };
  }

  // text variant — only fg shifts on hover/active; focus uses a filled-like state
  if (state === 'default' || state === 'disabled') {
    return { bg: 'transparent', fg: color, border: 'transparent' };
  }

  if (state === 'hover') {
    return { bg: 'transparent', fg: `${color}-hover`, border: 'transparent' };
  }

  if (state === 'focus') {
    return { bg: `${color}-hover`, fg: `${color}-on`, border: `${color}-hover` };
  }

  return { bg: 'transparent', fg: `${color}-active`, border: 'transparent' };
}

function plainPalette(state: State): ButtonPalette {
  if (state === 'hover' || state === 'active' || state === 'focus') {
    return { bg: 'neutral-soft-hover', fg: 'fg', border: 'border' };
  }

  return { bg: 'transparent', fg: 'fg', border: 'border' };
}

function bindFillFromPalette(component: ComponentNode, vars: GeneratedVariables, key: string | 'transparent'): void {
  if (key === 'transparent') {
    component.fills = [];

    return;
  }

  const variable = getColorVar(vars, key);

  if (variable) component.fills = [variableBoundFill(variable)];
}

function bindStrokeFromPalette(component: ComponentNode, vars: GeneratedVariables, key: string | 'transparent'): void {
  if (key === 'transparent') {
    component.strokes = [];

    return;
  }

  const variable = getColorVar(vars, key);

  if (variable) component.strokes = [variableBoundFill(variable)];
}

function colorAwareName(size: Size, color: Color, variant: ColorAwareVariant, state: State): string {
  return `Size=${size}, Color=${color}, Variant=${variant}, State=${state}`;
}

function plainName(size: Size, state: State): string {
  return `Size=${size}, Color=primary, Variant=plain, State=${state}`;
}

async function buildVariant(
  vars: GeneratedVariables,
  size: Size,
  variantName: string,
  palette: ButtonPalette,
  state: State
): Promise<ComponentNode> {
  const sizeTokens = sizeTokensFor(size);

  const component = figma.createComponent();
  component.name = variantName;
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingTop = sizeTokens.paddingY;
  component.paddingBottom = sizeTokens.paddingY;
  component.paddingLeft = sizeTokens.paddingX;
  component.paddingRight = sizeTokens.paddingX;
  component.itemSpacing = sizeTokens.gap;
  component.cornerRadius = tokens.primitives.radius.sm;
  component.strokeAlign = 'INSIDE';
  component.strokeWeight = tokens.primitives.borderWidth.base;
  component.clipsContent = false;

  bindFillFromPalette(component, vars, palette.bg);
  bindStrokeFromPalette(component, vars, palette.border);

  const fgVar = getColorVar(vars, palette.fg);
  const labelText = await createText({
    text: 'Button',
    fontSizePx: sizeTokens.fontSize,
    weight: tokens.primitives.fontWeight.medium,
    colorVar: fgVar,
    lineHeight: tokens.primitives.lineHeight.none,
  });
  component.appendChild(labelText);

  if (state === 'disabled') {
    component.opacity = tokens.primitives.opacity.disabled;
  }

  return component;
}

export async function generateButton(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
  const components: ComponentNode[] = [];

  for (const size of SIZES) {
    for (const color of COLORS) {
      for (const variant of COLOR_AWARE_VARIANTS) {
        for (const state of STATES) {
          const palette = paletteFor(color, variant, state);
          const name = colorAwareName(size, color, variant, state);
          const component = await buildVariant(vars, size, name, palette, state);

          page.appendChild(component);
          components.push(component);
        }
      }
    }

    for (const state of STATES) {
      const palette = plainPalette(state);
      const name = plainName(size, state);
      const component = await buildVariant(vars, size, name, palette, state);

      page.appendChild(component);
      components.push(component);
    }
  }

  const set = combineAsVariants(components, 'Button');
  page.appendChild(set);

  return set;
}

/** sanity export so the unused AnyVariant type isn't flagged */
export type _ButtonAnyVariant = AnyVariant;
