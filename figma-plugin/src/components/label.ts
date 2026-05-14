import { type GeneratedVariables, getColorVar } from '../lib/variables';
import { combineAsVariants, createIcon, createText, tintIcon } from '../lib/build-helpers';
import { tokens } from '../lib/tokens';

type Required = 'no' | 'yes';
type Loading = 'no' | 'yes';

function variantName(required: Required, loading: Loading): string {
  return `Required=${required}, Loading=${loading}`;
}

async function buildVariant(vars: GeneratedVariables, required: Required, loading: Loading): Promise<ComponentNode> {
  const component = figma.createComponent();
  component.name = variantName(required, loading);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'AUTO';
  component.primaryAxisAlignItems = 'CENTER';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = tokens.primitives.spacing['1_5'];
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;

  const fgVar = getColorVar(vars, 'fg');
  const dangerVar = getColorVar(vars, 'danger');
  const mutedVar = getColorVar(vars, 'fg-muted');

  const labelText = await createText({
    text: 'Label',
    fontSizePx: tokens.primitives.fontSize.sm,
    weight: tokens.primitives.fontWeight.medium,
    colorVar: fgVar,
    lineHeight: tokens.primitives.lineHeight.tight,
  });

  component.appendChild(labelText);

  if (required === 'yes') {
    const marker = await createText({
      text: '*',
      fontSizePx: tokens.primitives.fontSize.sm,
      weight: tokens.primitives.fontWeight.semibold,
      colorVar: dangerVar,
      lineHeight: tokens.primitives.lineHeight.none,
    });

    component.appendChild(marker);
  }

  if (loading === 'yes') {
    const spinnerSizePx = tokens.primitives.fontSize.sm + 2;
    const spinner = createIcon('loader', spinnerSizePx);

    if (spinner) {
      if (mutedVar) tintIcon(spinner, mutedVar);

      component.appendChild(spinner);
    }
  }

  return component;
}

export async function generateLabel(vars: GeneratedVariables, page: PageNode): Promise<ComponentSetNode> {
  const components: ComponentNode[] = [];

  for (const required of ['no', 'yes'] as const) {
    for (const loading of ['no', 'yes'] as const) {
      const component = await buildVariant(vars, required, loading);
      page.appendChild(component);
      components.push(component);
    }
  }

  const set = combineAsVariants(components, 'Label');
  page.appendChild(set);

  return set;
}
