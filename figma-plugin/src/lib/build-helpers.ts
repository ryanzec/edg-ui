import { svgFor, type IconName } from './icons';
import { fontForWeight, loadFonts } from './fonts';
import { getColorVar, type GeneratedVariables } from './variables';
import { tokens, type Rgba } from './tokens';

/** options for creating an auto-layout frame */
export type AutoLayoutOptions = {
  name: string;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  itemSpacing?: number;
  cornerRadius?: number;
  strokeWeight?: number;
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  width?: number;
  height?: number;
};

/** build a horizontal-by-default auto-layout frame with sensible primary/counter axis defaults */
export function createAutoLayoutFrame(options: AutoLayoutOptions): FrameNode {
  const frame = figma.createFrame();

  frame.name = options.name;
  frame.layoutMode = options.direction ?? 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.primaryAxisAlignItems = options.primaryAxisAlignItems ?? 'CENTER';
  frame.counterAxisAlignItems = options.counterAxisAlignItems ?? 'CENTER';
  frame.paddingTop = options.paddingTop ?? 0;
  frame.paddingRight = options.paddingRight ?? 0;
  frame.paddingBottom = options.paddingBottom ?? 0;
  frame.paddingLeft = options.paddingLeft ?? 0;
  frame.itemSpacing = options.itemSpacing ?? 0;
  frame.cornerRadius = options.cornerRadius ?? 0;
  frame.strokeWeight = options.strokeWeight ?? 0;
  frame.fills = [];
  frame.strokes = [];

  if (options.width !== undefined && options.height !== undefined) {
    frame.resize(options.width, options.height);
  }

  return frame;
}

/** build a solid paint bound to a figma color variable (so the variable controls the actual color) */
export function variableBoundFill(variable: Variable): SolidPaint {
  const placeholder: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };

  return figma.variables.setBoundVariableForPaint(placeholder, 'color', variable);
}

/** build a solid paint with an absolute rgba value (no variable binding) */
export function literalFill(rgba: Rgba): SolidPaint {
  return {
    type: 'SOLID',
    color: { r: rgba.r, g: rgba.g, b: rgba.b },
    opacity: rgba.a,
  };
}

/** bind a frame's fill to a primitive color variable by token key (e.g. "primary") */
export function bindFrameFillToColor(frame: FrameNode, variable: Variable): void {
  frame.fills = [variableBoundFill(variable)];
}

/** bind a frame's stroke to a primitive color variable */
export function bindFrameStrokeToColor(frame: FrameNode, variable: Variable, weight: number): void {
  frame.strokes = [variableBoundFill(variable)];
  frame.strokeWeight = weight;
}

/** bind a numeric variable to one of a node's bindable numeric properties */
export function bindNumberProperty(
  node: FrameNode | ComponentNode | TextNode,
  property: VariableBindableNodeField,
  variable: Variable
): void {
  node.setBoundVariable(property, variable);
}

/** create a text node with the given content, font weight, and bound color variable */
export async function createText(options: {
  text: string;
  fontSizePx: number;
  weight?: number;
  colorVar?: Variable;
  literalColor?: Rgba;
  lineHeight?: number;
  letterSpacing?: number;
}): Promise<TextNode> {
  const fonts = await loadFonts();
  const font = fontForWeight(fonts, options.weight ?? 400);

  const node = figma.createText();

  node.fontName = font;
  node.fontSize = options.fontSizePx;
  node.characters = options.text;

  if (options.lineHeight !== undefined) {
    node.lineHeight = { value: options.lineHeight * 100, unit: 'PERCENT' };
  }

  if (options.letterSpacing !== undefined) {
    node.letterSpacing = { value: options.letterSpacing, unit: 'PIXELS' };
  }

  if (options.colorVar) {
    node.fills = [variableBoundFill(options.colorVar)];
  } else if (options.literalColor) {
    node.fills = [literalFill(options.literalColor)];
  }

  return node;
}

/** create an icon node by name from inline svg, sized and color-tinted */
export function createIcon(name: IconName, sizePx: number): FrameNode | null {
  const node = figma.createNodeFromSvg(svgFor(name, sizePx));

  if (!node) return null;

  node.name = name;
  node.resize(sizePx, sizePx);

  return node;
}

/** apply a color variable (or literal rgba) to all stroke children of an svg-derived frame */
export function tintIcon(icon: FrameNode, colorVar?: Variable, literalColor?: Rgba): void {
  const apply = (node: SceneNode): void => {
    if ('strokes' in node && node.strokes.length > 0) {
      const paint: SolidPaint = colorVar
        ? variableBoundFill(colorVar)
        : literalFill(literalColor ?? { r: 0, g: 0, b: 0, a: 1 });
      node.strokes = [paint];
    }

    if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
      const paint: SolidPaint = colorVar
        ? variableBoundFill(colorVar)
        : literalFill(literalColor ?? { r: 0, g: 0, b: 0, a: 1 });
      node.fills = [paint];
    }

    if ('children' in node) {
      for (const child of node.children) apply(child);
    }
  };

  apply(icon);
}

/** combine a list of components into a component set named by the component */
export function combineAsVariants(components: ComponentNode[], setName: string): ComponentSetNode {
  if (components.length === 0) {
    throw new Error(`cannot combine zero components into a variant set: ${setName}`);
  }

  const parent = components[0].parent;
  const set = figma.combineAsVariants(components, parent ?? figma.currentPage);

  set.name = setName;
  set.layoutMode = 'NONE';
  set.fills = [];
  set.strokes = [];
  set.itemSpacing = 24;
  set.paddingTop = 24;
  set.paddingRight = 24;
  set.paddingBottom = 24;
  set.paddingLeft = 24;

  return set;
}

/** layout a list of component sets onto a page in a tidy stacked column */
export function layoutPageContents(page: PageNode, gap = 64): void {
  let y = 0;

  for (const child of page.children) {
    if ('y' in child && 'height' in child && 'x' in child) {
      child.x = 0;
      child.y = y;
      y += child.height + gap;
    }
  }
}

/** look up a primitive color variable that drives the on-accent / inverse foreground for a sentiment */
export function colorOnFor(vars: GeneratedVariables, sentiment: string): Variable {
  // every sentiment color in the codebase has a `<sentiment>-on` fg counterpart
  const variable = getColorVar(vars, `${sentiment}-on`);

  if (variable) return variable;

  // fall back to the muted-fg primitive if a sentiment-specific on color is missing
  const fallback = getColorVar(vars, 'fg-on-accent');

  if (fallback) return fallback;

  throw new Error(`no on-accent color variable for sentiment "${sentiment}"`);
}

/** resolve a component css token key to its alias target name in the codebase token system */
export function rawAliasName(component: string, tokenKey: string): string | null {
  const t = tokens.components[component]?.[tokenKey];

  if (!t) return null;

  const match = /^var\(--([\w-]+)\)$/.exec(t.raw.trim());

  return match ? match[1] : null;
}
