import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createIcon, createText, tintIcon } from '../lib/build-helpers';
import { type IconName } from '../lib/icons';
import { tokens } from '../lib/tokens';

const SIZES = ['sm', 'base', 'lg'] as const;
const COLORS = ['primary', 'danger'] as const;
const STATES = ['unchecked', 'checked', 'indeterminate', 'error', 'disabled'] as const;

type Size = (typeof SIZES)[number];
type Color = (typeof COLORS)[number];
type State = (typeof STATES)[number];

type SizeTokens = {
  indicatorSize: number;
  gap: number;
  labelFontSize: number;
  descriptionFontSize: number;
};

function sizeTokensFor(size: Size): SizeTokens {
  if (size === 'sm') {
    return {
      indicatorSize: 16,
      gap: tokens.primitives.spacing['1_5'],
      labelFontSize: tokens.primitives.fontSize.sm,
      descriptionFontSize: tokens.primitives.fontSize.xs,
    };
  }

  if (size === 'lg') {
    return {
      indicatorSize: 22,
      gap: tokens.primitives.spacing['3'],
      labelFontSize: tokens.primitives.fontSize.lg,
      descriptionFontSize: tokens.primitives.fontSize.sm,
    };
  }

  return {
    indicatorSize: 18,
    gap: tokens.primitives.spacing['2'],
    labelFontSize: tokens.primitives.fontSize.base,
    descriptionFontSize: tokens.primitives.fontSize.xs,
  };
}

function iconForState(state: State): IconName {
  if (state === 'checked') return 'square-check-big';
  if (state === 'indeterminate') return 'square-minus';

  return 'square';
}

function indicatorColor(color: Color, state: State): string {
  if (state === 'error') return 'danger';
  if (state === 'checked' || state === 'indeterminate') return color;

  return 'neutral';
}

function variantName(size: Size, color: Color, state: State): string {
  return `Size=${size}, Color=${color}, State=${state}`;
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

  const iconName = iconForState(state);
  const iconColorVar = getColorVar(vars, indicatorColor(color, state));
  const icon = createIcon(iconName, sizeTokens.indicatorSize);

  if (icon) {
    if (iconColorVar) tintIcon(icon, iconColorVar);

    component.appendChild(icon);
  }

  const body = figma.createFrame();
  body.name = 'body';
  body.layoutMode = 'VERTICAL';
  body.primaryAxisSizingMode = 'AUTO';
  body.counterAxisSizingMode = 'AUTO';
  body.itemSpacing = tokens.primitives.spacing['0_5'];
  body.fills = [];

  const fgVar = getColorVar(vars, 'fg');
  const mutedVar = getColorVar(vars, 'fg-muted');

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
    colorVar: mutedVar,
    lineHeight: tokens.primitives.lineHeight.normal,
  });
  body.appendChild(description);

  component.appendChild(body);

  if (state === 'disabled') {
    component.opacity = tokens.primitives.opacity.disabled;
  }

  return component;
}

export async function generateCheckbox(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
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

  const set = combineAsVariants(components, 'Checkbox');
  page.appendChild(set);

  return set;
}
