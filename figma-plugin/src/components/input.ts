import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createText, variableBoundFill } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

const VARIANTS = ['bordered', 'borderless', 'inline'] as const;
const STATES = ['default', 'hover', 'focus', 'error', 'disabled', 'readonly'] as const;

type InputVariantName = (typeof VARIANTS)[number];
type InputState = (typeof STATES)[number];

type InputPalette = {
  bg: string | null;
  border: string | null;
  fg: string;
  placeholder: string;
};

function paletteFor(variant: InputVariantName, state: InputState): InputPalette {
  // start from variant defaults then layer state overrides on top
  const base: InputPalette = (() => {
    if (variant === 'bordered') return { bg: 'bg-surface', border: 'border', fg: 'fg', placeholder: 'fg-faint' };
    if (variant === 'borderless') return { bg: null, border: null, fg: 'fg', placeholder: 'fg-faint' };

    // inline
    return { bg: null, border: null, fg: 'fg-muted', placeholder: 'fg-faint' };
  })();

  if (state === 'hover') {
    if (variant === 'bordered') return { ...base, border: 'info' };
    if (variant === 'borderless') return { ...base, bg: 'bg-surface-secondary' };

    return { ...base, fg: 'fg' };
  }

  if (state === 'focus') {
    if (variant === 'inline') return { ...base, fg: 'fg', border: 'info' };

    return { ...base, border: 'info' };
  }

  if (state === 'error') {
    return { ...base, border: 'danger' };
  }

  if (state === 'readonly' && variant !== 'inline') {
    return { ...base, bg: 'bg-surface-secondary' };
  }

  return base;
}

function variantName(variant: InputVariantName, state: InputState): string {
  return `Variant=${variant}, State=${state}`;
}

async function buildVariant(
  vars: GeneratedVariables,
  variant: InputVariantName,
  state: InputState
): Promise<ComponentNode> {
  const palette = paletteFor(variant, state);

  const component = figma.createComponent();
  component.name = variantName(variant, state);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.primaryAxisAlignItems = 'MIN';
  component.counterAxisAlignItems = 'CENTER';
  component.resize(220, 30);
  component.paddingLeft = tokens.primitives.spacing['2'];
  component.paddingRight = tokens.primitives.spacing['2'];
  component.cornerRadius = variant === 'inline' ? 0 : tokens.primitives.radius.sm;
  component.strokeAlign = 'INSIDE';
  component.strokeWeight = tokens.primitives.borderWidth.base;
  component.clipsContent = true;

  // backgrounds / borders
  const bgVar = palette.bg ? getColorVar(vars, palette.bg) : undefined;

  if (bgVar) {
    component.fills = [variableBoundFill(bgVar)];
  } else {
    component.fills = [];
  }

  if (palette.border) {
    const borderVar = getColorVar(vars, palette.border);

    if (borderVar) component.strokes = [variableBoundFill(borderVar)];
  } else if (variant === 'inline' && state === 'focus') {
    const focus = getColorVar(vars, 'info');

    if (focus) {
      component.strokes = [variableBoundFill(focus)];
      component.strokeBottomWeight = tokens.primitives.borderWidth.base;
      component.strokeTopWeight = 0;
      component.strokeLeftWeight = 0;
      component.strokeRightWeight = 0;
    }
  } else {
    component.strokes = [];
  }

  // placeholder text (single line)
  const placeholderVar = getColorVar(vars, palette.placeholder);
  const placeholder = await createText({
    text: 'Placeholder',
    fontSizePx: tokens.primitives.fontSize.base,
    weight: tokens.primitives.fontWeight.regular,
    colorVar: placeholderVar,
    lineHeight: tokens.primitives.lineHeight.tight,
  });
  component.appendChild(placeholder);

  if (state === 'disabled') {
    component.opacity = tokens.primitives.opacity.disabled;
  }

  return component;
}

export async function generateInput(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
  const components: ComponentNode[] = [];

  for (const variant of VARIANTS) {
    for (const state of STATES) {
      const component = await buildVariant(vars, variant, state);
      page.appendChild(component);
      components.push(component);
    }
  }

  const set = combineAsVariants(components, 'Input');
  page.appendChild(set);

  return set;
}
