'use strict';

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BASE_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/base-tokens.css');
const CHART_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/chart-tokens.css');
const SCROLLBAR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/scrollbar-tokens.css');
const AVATAR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/avatar-tokens.css');
const ICON_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/icon-tokens.css');
const INDICATOR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/indicator-tokens.css');
const LABEL_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/label-tokens.css');
const LAST_UPDATED_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/last-updated-tokens.css',
);
const LINK_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/link-tokens.css');
const LOADING_BLOCKER_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/loading-blocker-tokens.css',
);
const NOTIFICATION_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/notification-tokens.css',
);
const TABS_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/tabs-tokens.css');
const TAG_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/tag-tokens.css');
const TIMELINE_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/timeline-tokens.css');
const TOOLTIP_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/tooltip-tokens.css');
const BUTTON_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/button-tokens.css');
const CALENDAR_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/calendar-tokens.css');
const CARD_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/card-tokens.css');
const CHAT_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/chat-tokens.css');
const CHECKBOX_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/checkbox-tokens.css');
const CHECKBOX_TOGGLE_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/checkbox-toggle-tokens.css',
);
const CHECKLIST_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/checklist-tokens.css');
const CODE_BLOCK_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/code-block-tokens.css');
const COMBOBOX_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/combobox-tokens.css');
const DIALOG_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/dialog-tokens.css');
const DESIGN_SYSTEM_DEMO_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/design-system-demo-tokens.css',
);
const DIVIDER_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/divider-tokens.css');
const DROP_DOWN_SELECTOR_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/drop-down-selector-tokens.css',
);
const OVERLAY_MENU_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/overlay-menu-tokens.css');
const PAGINATION_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/pagination-tokens.css');
const RADIO_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/radio-tokens.css');
const RADIO_GROUP_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/radio-group-tokens.css',
);
const SKELETON_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/skeleton-tokens.css');
const TABLE_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/table-tokens.css');
const TEXTAREA_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/textarea-tokens.css');
const EMPTY_INDICATOR_TOKENS_CSS = path.join(
  REPO_ROOT,
  'projects/shared-ui/src/lib/styles/tokens/empty-indicator-tokens.css',
);
const INPUT_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/tokens/input-tokens.css');
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
  return `// Auto-generated from tokens based css files — do not edit manually.
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

async function main() {
  const cleanCss = (content) =>
    content.replace(/@import[^;]+;/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

  const baseContent = cleanCss(fs.readFileSync(BASE_TOKENS_CSS, 'utf-8'));
  const chartContent = cleanCss(fs.readFileSync(CHART_TOKENS_CSS, 'utf-8'));
  const scrollbarContent = cleanCss(fs.readFileSync(SCROLLBAR_TOKENS_CSS, 'utf-8'));
  const avatarContent = cleanCss(fs.readFileSync(AVATAR_TOKENS_CSS, 'utf-8'));
  const iconContent = cleanCss(fs.readFileSync(ICON_TOKENS_CSS, 'utf-8'));
  const indicatorContent = cleanCss(fs.readFileSync(INDICATOR_TOKENS_CSS, 'utf-8'));
  const labelContent = cleanCss(fs.readFileSync(LABEL_TOKENS_CSS, 'utf-8'));
  const lastUpdatedContent = cleanCss(fs.readFileSync(LAST_UPDATED_TOKENS_CSS, 'utf-8'));
  const linkContent = cleanCss(fs.readFileSync(LINK_TOKENS_CSS, 'utf-8'));
  const loadingBlockerContent = cleanCss(fs.readFileSync(LOADING_BLOCKER_TOKENS_CSS, 'utf-8'));
  const notificationContent = cleanCss(fs.readFileSync(NOTIFICATION_TOKENS_CSS, 'utf-8'));
  const tabsContent = cleanCss(fs.readFileSync(TABS_TOKENS_CSS, 'utf-8'));
  const tagContent = cleanCss(fs.readFileSync(TAG_TOKENS_CSS, 'utf-8'));
  const timelineContent = cleanCss(fs.readFileSync(TIMELINE_TOKENS_CSS, 'utf-8'));
  const tooltipContent = cleanCss(fs.readFileSync(TOOLTIP_TOKENS_CSS, 'utf-8'));
  const buttonContent = cleanCss(fs.readFileSync(BUTTON_TOKENS_CSS, 'utf-8'));
  const calendarContent = cleanCss(fs.readFileSync(CALENDAR_TOKENS_CSS, 'utf-8'));
  const cardContent = cleanCss(fs.readFileSync(CARD_TOKENS_CSS, 'utf-8'));
  const chatContent = cleanCss(fs.readFileSync(CHAT_TOKENS_CSS, 'utf-8'));
  const checkboxContent = cleanCss(fs.readFileSync(CHECKBOX_TOKENS_CSS, 'utf-8'));
  const checkboxToggleContent = cleanCss(fs.readFileSync(CHECKBOX_TOGGLE_TOKENS_CSS, 'utf-8'));
  const checklistContent = cleanCss(fs.readFileSync(CHECKLIST_TOKENS_CSS, 'utf-8'));
  const codeBlockContent = cleanCss(fs.readFileSync(CODE_BLOCK_TOKENS_CSS, 'utf-8'));
  const comboboxContent = cleanCss(fs.readFileSync(COMBOBOX_TOKENS_CSS, 'utf-8'));
  const dialogContent = cleanCss(fs.readFileSync(DIALOG_TOKENS_CSS, 'utf-8'));
  const designSystemDemoContent = cleanCss(fs.readFileSync(DESIGN_SYSTEM_DEMO_TOKENS_CSS, 'utf-8'));
  const dividerContent = cleanCss(fs.readFileSync(DIVIDER_TOKENS_CSS, 'utf-8'));
  const dropDownSelectorContent = cleanCss(fs.readFileSync(DROP_DOWN_SELECTOR_TOKENS_CSS, 'utf-8'));
  const emptyIndicatorContent = cleanCss(fs.readFileSync(EMPTY_INDICATOR_TOKENS_CSS, 'utf-8'));
  const inputContent = cleanCss(fs.readFileSync(INPUT_TOKENS_CSS, 'utf-8'));
  const overlayMenuContent = cleanCss(fs.readFileSync(OVERLAY_MENU_TOKENS_CSS, 'utf-8'));
  const paginationContent = cleanCss(fs.readFileSync(PAGINATION_TOKENS_CSS, 'utf-8'));
  const radioContent = cleanCss(fs.readFileSync(RADIO_TOKENS_CSS, 'utf-8'));
  const radioGroupContent = cleanCss(fs.readFileSync(RADIO_GROUP_TOKENS_CSS, 'utf-8'));
  const skeletonContent = cleanCss(fs.readFileSync(SKELETON_TOKENS_CSS, 'utf-8'));
  const tableContent = cleanCss(fs.readFileSync(TABLE_TOKENS_CSS, 'utf-8'));
  const textareaContent = cleanCss(fs.readFileSync(TEXTAREA_TOKENS_CSS, 'utf-8'));

  // Base tokens: all :root vars; color vars are used only for resolution, non-color vars are also output
  const baseVars = Object.assign({}, ...findBlocks(baseContent, ':root').map(extractVariables));

  // System tokens
  const systemRootVars = Object.assign(
    {},
    ...findBlocks(chartContent, ':root').map(extractVariables),
    ...findBlocks(scrollbarContent, ':root').map(extractVariables),
    ...findBlocks(avatarContent, ':root').map(extractVariables),
    ...findBlocks(iconContent, ':root').map(extractVariables),
    ...findBlocks(indicatorContent, ':root').map(extractVariables),
    ...findBlocks(labelContent, ':root').map(extractVariables),
    ...findBlocks(lastUpdatedContent, ':root').map(extractVariables),
    ...findBlocks(linkContent, ':root').map(extractVariables),
    ...findBlocks(loadingBlockerContent, ':root').map(extractVariables),
    ...findBlocks(notificationContent, ':root').map(extractVariables),
    ...findBlocks(tabsContent, ':root').map(extractVariables),
    ...findBlocks(tagContent, ':root').map(extractVariables),
    ...findBlocks(timelineContent, ':root').map(extractVariables),
    ...findBlocks(tooltipContent, ':root').map(extractVariables),
    ...findBlocks(buttonContent, ':root').map(extractVariables),
    ...findBlocks(calendarContent, ':root').map(extractVariables),
    ...findBlocks(cardContent, ':root').map(extractVariables),
    ...findBlocks(chatContent, ':root').map(extractVariables),
    ...findBlocks(checkboxContent, ':root').map(extractVariables),
    ...findBlocks(checkboxToggleContent, ':root').map(extractVariables),
    ...findBlocks(checklistContent, ':root').map(extractVariables),
    ...findBlocks(codeBlockContent, ':root').map(extractVariables),
    ...findBlocks(comboboxContent, ':root').map(extractVariables),
    ...findBlocks(dialogContent, ':root').map(extractVariables),
    ...findBlocks(designSystemDemoContent, ':root').map(extractVariables),
    ...findBlocks(dividerContent, ':root').map(extractVariables),
    ...findBlocks(dropDownSelectorContent, ':root').map(extractVariables),
    ...findBlocks(emptyIndicatorContent, ':root').map(extractVariables),
    ...findBlocks(inputContent, ':root').map(extractVariables),
    ...findBlocks(overlayMenuContent, ':root').map(extractVariables),
    ...findBlocks(paginationContent, ':root').map(extractVariables),
    ...findBlocks(radioContent, ':root').map(extractVariables),
    ...findBlocks(radioGroupContent, ':root').map(extractVariables),
    ...findBlocks(skeletonContent, ':root').map(extractVariables),
    ...findBlocks(tableContent, ':root').map(extractVariables),
    ...findBlocks(textareaContent, ':root').map(extractVariables),
  );
  const darkVars = Object.assign(
    {},
    ...findBlocks(baseContent, '.dark').map(extractVariables),
    ...findBlocks(chartContent, '.dark').map(extractVariables),
    ...findBlocks(scrollbarContent, '.dark').map(extractVariables),
    ...findBlocks(avatarContent, '.dark').map(extractVariables),
    ...findBlocks(iconContent, '.dark').map(extractVariables),
    ...findBlocks(indicatorContent, '.dark').map(extractVariables),
    ...findBlocks(labelContent, '.dark').map(extractVariables),
    ...findBlocks(lastUpdatedContent, '.dark').map(extractVariables),
    ...findBlocks(linkContent, '.dark').map(extractVariables),
    ...findBlocks(loadingBlockerContent, '.dark').map(extractVariables),
    ...findBlocks(notificationContent, '.dark').map(extractVariables),
    ...findBlocks(tabsContent, '.dark').map(extractVariables),
    ...findBlocks(tagContent, '.dark').map(extractVariables),
    ...findBlocks(timelineContent, '.dark').map(extractVariables),
    ...findBlocks(tooltipContent, '.dark').map(extractVariables),
    ...findBlocks(buttonContent, '.dark').map(extractVariables),
    ...findBlocks(calendarContent, '.dark').map(extractVariables),
    ...findBlocks(cardContent, '.dark').map(extractVariables),
    ...findBlocks(chatContent, '.dark').map(extractVariables),
    ...findBlocks(checkboxContent, '.dark').map(extractVariables),
    ...findBlocks(checkboxToggleContent, '.dark').map(extractVariables),
    ...findBlocks(checklistContent, '.dark').map(extractVariables),
    ...findBlocks(codeBlockContent, '.dark').map(extractVariables),
    ...findBlocks(comboboxContent, '.dark').map(extractVariables),
    ...findBlocks(dialogContent, '.dark').map(extractVariables),
    ...findBlocks(designSystemDemoContent, '.dark').map(extractVariables),
    ...findBlocks(dividerContent, '.dark').map(extractVariables),
    ...findBlocks(dropDownSelectorContent, '.dark').map(extractVariables),
    ...findBlocks(emptyIndicatorContent, '.dark').map(extractVariables),
    ...findBlocks(inputContent, '.dark').map(extractVariables),
    ...findBlocks(overlayMenuContent, '.dark').map(extractVariables),
    ...findBlocks(paginationContent, '.dark').map(extractVariables),
    ...findBlocks(radioContent, '.dark').map(extractVariables),
    ...findBlocks(radioGroupContent, '.dark').map(extractVariables),
    ...findBlocks(skeletonContent, '.dark').map(extractVariables),
    ...findBlocks(tableContent, '.dark').map(extractVariables),
    ...findBlocks(textareaContent, '.dark').map(extractVariables),
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

  const prettierConfig = await prettier.resolveConfig(OUTPUT_TS);
  const formatted = await prettier.format(tsContent, {
    ...prettierConfig,
    filepath: OUTPUT_TS,
  });

  fs.writeFileSync(OUTPUT_TS, formatted, 'utf-8');

  console.log(`Generated ${Object.keys(colorLightMap).length} light color tokens`);
  console.log(`Generated ${Object.keys(colorDarkMap).length} dark color tokens`);
  console.log(`Generated ${Object.keys(nonColorMap).length} non-color tokens`);
  console.log(`Output: ${OUTPUT_TS}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
