import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createText, literalFill, variableBoundFill } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

const SIZES = ['sm', 'base', 'lg'] as const;
const COLORS = ['primary', 'danger'] as const;
const STATES = ['unchecked', 'checked', 'error', 'disabled'] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];
type State = (typeof STATES)[number];

type SizeTokens = {
  indicatorSize: number;
  markSize: number;
  gap: number;
  labelFontSize: number;
  descriptionFontSize: number;
};

function sizeTokensFor(size: Size): SizeTokens {
  if (size === 'sm') {
    return {
      indicatorSize: 14,
      markSize: 7,
      gap: tokens.primitives.spacing['1_5'],
      labelFontSize: tokens.primitives.fontSize.sm,
      descriptionFontSize: tokens.primitives.fontSize.xs,
    };
  }

  if (size === 'lg') {
    return {
      indicatorSize: 20,
      markSize: 10,
      gap: tokens.primitives.spacing['3'],
      labelFontSize: tokens.primitives.fontSize.lg,
      descriptionFontSize: tokens.primitives.fontSize.sm,
    };
  }

  return {
    indicatorSize: 16,
    markSize: 8,
    gap: tokens.primitives.spacing['2'],
    labelFontSize: tokens.primitives.fontSize.base,
    descriptionFontSize: tokens.primitives.fontSize.xs,
  };
}

function variantName(size: Size, color: Color, state: State): string {
  return `Size=${size}, Color=${color}, State=${state}`;
}

function fillSentiment(color: Color, state: State): string {
  return state === 'error' ? 'danger' : color;
}

async function buildIndicator(vars: GeneratedVariables, size: Size, color: Color, state: State): Promise<FrameNode> {
  const sizeTokens = sizeTokensFor(size);
  const ring = figma.createFrame();
  ring.name = 'indicator';
  ring.resize(sizeTokens.indicatorSize, sizeTokens.indicatorSize);
  ring.cornerRadius = sizeTokens.indicatorSize / 2;
  ring.layoutMode = 'HORIZONTAL';
  ring.primaryAxisSizingMode = 'FIXED';
  ring.counterAxisSizingMode = 'FIXED';
  ring.primaryAxisAlignItems = 'CENTER';
  ring.counterAxisAlignItems = 'CENTER';
  ring.strokeAlign = 'INSIDE';
  ring.strokeWeight = tokens.primitives.borderWidth.base;

  const fillSent = fillSentiment(color, state);
  const isChecked = state === 'checked';

  if (isChecked) {
    const fillVar = getColorVar(vars, fillSent);
    const onVar = getColorVar(vars, `${fillSent}-on`);

    if (fillVar) {
      ring.fills = [variableBoundFill(fillVar)];
      ring.strokes = [variableBoundFill(fillVar)];
    }

    const mark = figma.createEllipse();
    mark.name = 'mark';
    mark.resize(sizeTokens.markSize, sizeTokens.markSize);

    if (onVar) mark.fills = [variableBoundFill(onVar)];

    ring.appendChild(mark);
  } else {
    const surfaceVar = getColorVar(vars, 'bg-surface');
    const borderVar = state === 'error' ? getColorVar(vars, 'danger') : getColorVar(vars, 'border-strong');

    if (surfaceVar) ring.fills = [variableBoundFill(surfaceVar)];

    if (borderVar) ring.strokes = [variableBoundFill(borderVar)];
  }

  if (state === 'disabled') {
    ring.opacity = tokens.primitives.opacity.disabled;
  }

  return ring;
}

async function buildVariant(vars: GeneratedVariables, size: Size, color: Color, state: State): Promise<ComponentNode> {
  const sizeTokens = sizeTokensFor(size);

  const component = figma.createComponent();
  component.name = variantName(size, color, state);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'MIN';
  component.counterAxisAlignItems = 'MIN';
  component.itemSpacing = sizeTokens.gap;
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;

  const indicator = await buildIndicator(vars, size, color, state);
  component.appendChild(indicator);

  const body = figma.createFrame();
  body.name = 'body';
  body.layoutMode = 'VERTICAL';
  body.primaryAxisSizingMode = 'AUTO';
  body.counterAxisSizingMode = 'AUTO';
  body.itemSpacing = tokens.primitives.spacing['0_5'];
  body.fills = [];

  const fgVar = getColorVar(vars, 'fg');
  const fgMutedVar = getColorVar(vars, 'fg-muted');

  const labelText = await createText({
    text: 'Label',
    fontSizePx: sizeTokens.labelFontSize,
    weight: tokens.primitives.fontWeight.regular,
    colorVar: fgVar,
    lineHeight: tokens.primitives.lineHeight.normal,
  });
  body.appendChild(labelText);

  const description = await createText({
    text: 'Optional description',
    fontSizePx: sizeTokens.descriptionFontSize,
    weight: tokens.primitives.fontWeight.regular,
    colorVar: fgMutedVar,
    lineHeight: tokens.primitives.lineHeight.normal,
  });
  body.appendChild(description);

  component.appendChild(body);

  if (state === 'disabled') {
    component.opacity = tokens.primitives.opacity.disabled;
  }

  // suppress unused warning for the helper while keeping the import path for future literal use
  void literalFill;

  return component;
}

export async function generateRadio(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
  const components: ComponentNode[] = [];

  for (const size of SIZES) {
    for (const color of COLORS) {
      for (const state of STATES) {
        const component = await buildVariant(vars, size, color, state);
        page.appendChild(component);
        components.push(component);
      }
    }
  }

  const set = combineAsVariants(components, 'Radio');
  page.appendChild(set);

  return set;
}
