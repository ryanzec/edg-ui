import tokensData from '../generated/tokens.json';

/** color value normalized to the figma plugin api format */
export type Rgba = { r: number; g: number; b: number; a: number };

/** primitive color token with light and dark mode values */
export type ColorToken = { light: Rgba; dark: Rgba };

/** component-scoped token resolved as a color value */
export type ComponentTokenColor = { kind: 'color'; value: Rgba; raw: string };

/** component-scoped token resolved as a single numeric value (px) */
export type ComponentTokenNumber = { kind: 'number'; value: number; raw: string };

/** component-scoped token whose value is composite, non-numeric, or otherwise unresolvable */
export type ComponentTokenRaw = { kind: 'raw'; value: string; raw: string };

export type ComponentToken = ComponentTokenColor | ComponentTokenNumber | ComponentTokenRaw;

/** name of the variable collection created in figma */
export const COLLECTION_NAME = 'Design System';

/** primitive bucket types defined by the codebase token system */
export type PrimitiveBucket =
  | 'color'
  | 'radius'
  | 'spacing'
  | 'sizing'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'
  | 'borderWidth'
  | 'opacity';

export type Tokens = {
  generatedAt: string;
  primitives: {
    color: Record<string, ColorToken>;
    radius: Record<string, number>;
    spacing: Record<string, number>;
    sizing: Record<string, number>;
    fontSize: Record<string, number>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
    letterSpacing: Record<string, number>;
    borderWidth: Record<string, number>;
    opacity: Record<string, number>;
  };
  components: Record<string, Record<string, ComponentToken>>;
};

export const tokens = tokensData as unknown as Tokens;

/** the page name used for the variable collection's "library" frame (not a real figma page, just a label) */
export const PAGES = {
  variables: '[Design System] Variables',
  components: '[Design System] Components',
} as const;
