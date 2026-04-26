'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BASE_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/variables/base-tokens.css');
const SYSTEM_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/variables/system-tokens.css');
const CHART_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/variables/chart-tokens.css');
const SCROLLBAR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/variables/scrollbar-tokens.css');
const AVATAR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/variables/avatar-tokens.css');
const OUTPUT_TS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/design-tokens.ts');

/**
 * Extract CSS custom property declarations from a block of CSS text.
 * Returns a map of variable name (without leading --) to raw string value.
 * Later declarations overwrite earlier ones, matching CSS cascade behavior.
 */
function extractVariables(blockContent) {
  const vars = {};
  const lines = blockContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith('--')) continue;

    const colonIdx = trimmed.indexOf(':');

    if (colonIdx === -1) continue;

    // Strip the leading -- from the property name
    const name = trimmed.substring(2, colonIdx).trim();
    const rawValue = trimmed.substring(colonIdx + 1);

    // Strip trailing semicolon and inline comments
    const value = rawValue.replace(/;.*$/, '').trim();

    if (name && value) {
      vars[name] = value;
    }
  }

  return vars;
}

/**
 * Find all top-level CSS blocks matching a given selector string.
 * Handles nested braces correctly. Returns block content strings without the outer braces.
 */
function findBlocks(css, selector) {
  const blocks = [];
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const selectorPattern = new RegExp(`${escapedSelector}\\s*\\{`, 'g');

  let match;

  while ((match = selectorPattern.exec(css)) !== null) {
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;

    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }

    blocks.push(css.substring(start, i - 1));
  }

  return blocks;
}

/**
 * Convert a CSS variable name segment (without leading --) to a dot-notation path key.
 * Handles embedded double-dashes as nested separators, e.g.:
 *   "text-xs--line-height" → "text.xs.line.height"
 *   "font-weight-normal"   → "font.weight.normal"
 */
function toDotPath(name) {
  return name
    .split('--')
    .flatMap((part) => part.split('-'))
    .join('.');
}

/**
 * Resolve a CSS value by iteratively substituting var() references with concrete values.
 * Uses a global all-vars map and stops when the value stabilizes or max iterations is reached.
 */
function resolveValue(value, allVars, maxIterations = 20) {
  let resolved = value;
  const varPattern = /var\(--([\w-]+)\)/g;

  for (let i = 0; i < maxIterations; i++) {
    const newResolved = resolved.replace(varPattern, (_match, varName) => {
      const replacement = allVars[varName];
      return replacement !== undefined ? replacement : _match;
    });

    if (newResolved === resolved) break;

    resolved = newResolved;
  }

  return resolved;
}

/**
 * Build a flat token map from a variable dictionary.
 * For color vars: strips the "color-" prefix before converting to dot-path.
 * For non-color vars: converts the full name to dot-path.
 * Values are resolved against the provided allVars resolution map.
 */
function buildTokenMap(vars, isColor, allVars) {
  const tokenMap = {};

  for (const [name, rawValue] of Object.entries(vars)) {
    const resolvedValue = resolveValue(rawValue, allVars);
    const keySource = isColor ? name.replace(/^color-/, '') : name;
    const key = toDotPath(keySource);
    tokenMap[key] = resolvedValue;
  }

  return tokenMap;
}

/**
 * Returns true when a key must be quoted to be a valid JS property name.
 * Keys with dots, hyphens, or leading digits all require quoting.
 */
function needsQuotes(key) {
  return !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

/**
 * Serialize a flat string map to a formatted TypeScript object literal.
 * Keys are only quoted when they are not valid bare identifiers.
 */
function serializeMap(map) {
  const entries = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => {
      const keyStr = needsQuotes(k) ? `'${k}'` : k;
      return `  ${keyStr}: '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    })
    .join(',\n');

  return `{\n${entries},\n}`;
}

/**
 * Generate the full TypeScript file content for the design token system.
 */
function generateTypeScript(colorLight, colorDark, nonColorTokens) {
  return `// Auto-generated from base-tokens.css, system-tokens.css, chart-tokens.css, scrollbar-tokens.css, and avatar-tokens.css — do not edit manually.
// Run the build-typescript-design-token script to regenerate.

type DesignTokenTheme = 'light' | 'dark';

const colorLight: Record<string, string> = ${serializeMap(colorLight)};

const colorDark: Record<string, string> = ${serializeMap(colorDark)};

const nonColorTokens: Record<string, string> = ${serializeMap(nonColorTokens)};

function getNestedToken(map: Record<string, string>, dotPath: string): string | undefined {
  return map[dotPath];
}

export const designTokenUtils = {
  getColorToken(designTokenName: string, theme: DesignTokenTheme = 'light'): string | undefined {
    return getNestedToken(theme === 'light' ? colorLight : colorDark, designTokenName);
  },

  getToken(designTokenName: string): string | undefined {
    return getNestedToken(nonColorTokens, designTokenName);
  },
};
`;
}

function main() {
  const cleanCss = (content) =>
    content.replace(/@import[^;]+;/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  const baseContent = cleanCss(fs.readFileSync(BASE_TOKENS_CSS, 'utf-8'));
  const systemContent = cleanCss(fs.readFileSync(SYSTEM_TOKENS_CSS, 'utf-8'));
  const chartContent = cleanCss(fs.readFileSync(CHART_TOKENS_CSS, 'utf-8'));
  const scrollbarContent = cleanCss(fs.readFileSync(SCROLLBAR_TOKENS_CSS, 'utf-8'));
  const avatarContent = cleanCss(fs.readFileSync(AVATAR_TOKENS_CSS, 'utf-8'));

  // Base tokens: all :root vars; color vars are used only for resolution, non-color vars are also output
  const baseVars = Object.assign({}, ...findBlocks(baseContent, ':root').map(extractVariables));

  // System tokens: :root vars for output, .dark-theme vars for dark theme overrides; chart, scrollbar,
  // and avatar token files contribute to the same buckets so the resulting design-tokens.ts stays
  // equivalent regardless of which file a variable lives in
  const systemRootVars = Object.assign(
    {},
    ...findBlocks(systemContent, ':root').map(extractVariables),
    ...findBlocks(chartContent, ':root').map(extractVariables),
    ...findBlocks(scrollbarContent, ':root').map(extractVariables),
    ...findBlocks(avatarContent, ':root').map(extractVariables),
  );
  const darkVars = Object.assign(
    {},
    ...findBlocks(systemContent, '.dark-theme').map(extractVariables),
    ...findBlocks(chartContent, '.dark-theme').map(extractVariables),
    ...findBlocks(scrollbarContent, '.dark-theme').map(extractVariables),
    ...findBlocks(avatarContent, '.dark-theme').map(extractVariables),
  );

  // Resolution maps: base vars are always the foundation
  const lightAllVars = { ...baseVars, ...systemRootVars };
  const darkAllVars = { ...lightAllVars, ...darkVars };

  // Split base :root vars into color (used only for resolution) and non-color (output via getToken)
  const baseNonColorVars = {};

  for (const [name, value] of Object.entries(baseVars)) {
    if (!name.startsWith('color-')) {
      baseNonColorVars[name] = value;
    }
  }

  // Split system :root vars into color (--color-*) and non-color buckets for output
  const systemColorVars = {};
  const systemNonColorVars = {};

  for (const [name, value] of Object.entries(systemRootVars)) {
    if (name.startsWith('color-')) {
      systemColorVars[name] = value;
    } else {
      systemNonColorVars[name] = value;
    }
  }

  // Dark theme: only --color-* overrides are included (non-color dark overrides are skipped)
  const darkColorVars = {};

  for (const [name, value] of Object.entries(darkVars)) {
    if (name.startsWith('color-')) {
      darkColorVars[name] = value;
    }
  }

  // Build resolved flat token maps; base non-color vars are merged with system non-color vars,
  // with system vars taking precedence if there are any name collisions
  const colorLightMap = buildTokenMap(systemColorVars, true, lightAllVars);
  const colorDarkMap = buildTokenMap(darkColorVars, true, darkAllVars);
  const nonColorMap = buildTokenMap({ ...baseNonColorVars, ...systemNonColorVars }, false, lightAllVars);

  const tsContent = generateTypeScript(colorLightMap, colorDarkMap, nonColorMap);

  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8');

  console.log(`Generated ${Object.keys(colorLightMap).length} light color tokens`);
  console.log(`Generated ${Object.keys(colorDarkMap).length} dark color tokens`);
  console.log(`Generated ${Object.keys(nonColorMap).length} non-color tokens`);
  console.log(`Output: ${OUTPUT_TS}`);
}

main();
