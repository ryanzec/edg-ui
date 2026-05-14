'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BASE_TOKENS_CSS = path.join(REPO_ROOT, 'projects/shared-ui/src/lib/styles/base-tokens.css');
const PILOT_COMPONENTS = [
  'button',
  'tag',
  'input',
  'checkbox',
  'radio',
  'icon',
  'label',
  'loading-spinner',
];

function componentTokensPath(name) {
  return path.join(REPO_ROOT, `projects/shared-ui/src/lib/core/${name}/${name}-tokens.css`);
}

const OUTPUT_JSON = path.join(REPO_ROOT, 'figma-plugin/src/generated/tokens.json');

const REM_TO_PX = 16;

// ---------------------------------------------------------------------------
// css parsing — mirrors the pattern in build-typescript-design-token.cjs
// ---------------------------------------------------------------------------

function cleanCss(content) {
  return content.replace(/@import[^;]+;/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function extractVariables(blockContent) {
  const vars = {};
  const lines = blockContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed.startsWith('--')) continue;

    const colonIdx = trimmed.indexOf(':');

    if (colonIdx === -1) continue;

    const name = trimmed.substring(2, colonIdx).trim();
    const rawValue = trimmed.substring(colonIdx + 1).replace(/;.*$/, '').trim();

    if (name && rawValue) {
      vars[name] = rawValue;
    }
  }

  return vars;
}

function findBlocks(css, selector) {
  const blocks = [];
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`${escaped}\\s*\\{`, 'g');

  let match;

  while ((match = pattern.exec(css)) !== null) {
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

function resolveValue(value, allVars, maxIterations = 20) {
  let resolved = value;
  const varPattern = /var\(--([\w-]+)\)/g;

  for (let i = 0; i < maxIterations; i++) {
    const next = resolved.replace(varPattern, (match, name) => {
      const replacement = allVars[name];

      return replacement !== undefined ? replacement : match;
    });

    if (next === resolved) break;

    resolved = next;
  }

  return resolved;
}

// ---------------------------------------------------------------------------
// value converters — css to figma-compatible units
// ---------------------------------------------------------------------------

function remToPx(remString) {
  const match = /^(-?[\d.]+)rem$/.exec(remString);

  if (!match) return null;

  return parseFloat(match[1]) * REM_TO_PX;
}

function pxToNumber(pxString) {
  const match = /^(-?[\d.]+)px$/.exec(pxString);

  if (!match) return null;

  return parseFloat(match[1]);
}

function unitlessNumber(value) {
  if (/^-?[\d.]+$/.test(value)) return parseFloat(value);

  return null;
}

function toPx(value) {
  const trimmed = value.trim();
  const rem = remToPx(trimmed);

  if (rem !== null) return rem;

  const px = pxToNumber(trimmed);

  if (px !== null) return px;

  const unitless = unitlessNumber(trimmed);

  if (unitless !== null) return unitless;

  return null;
}

// ---------------------------------------------------------------------------
// oklch → srgb (figma needs rgb 0-1)
// ---------------------------------------------------------------------------

function oklchToOklab(L, C, H) {
  const hRad = (H * Math.PI) / 180;

  return {
    L,
    a: C * Math.cos(hRad),
    b: C * Math.sin(hRad),
  };
}

function oklabToLinearRgb(lab) {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function linearToSrgbChannel(c) {
  if (c <= 0) return 0;

  if (c >= 1) return 1;

  if (c <= 0.0031308) return 12.92 * c;

  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function parseOklch(value) {
  // matches: oklch(L C H) or oklch(L C H / A); whitespace-separated
  const match = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+(-?[\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/.exec(value);

  if (!match) return null;

  let alpha = 1;

  if (match[4] !== undefined) {
    const a = match[4];

    if (a.endsWith('%')) {
      alpha = parseFloat(a.slice(0, -1)) / 100;
    } else {
      alpha = parseFloat(a);
    }
  }

  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    H: parseFloat(match[3]),
    A: alpha,
  };
}

function oklchToRgb(oklch) {
  const lab = oklchToOklab(oklch.L, oklch.C, oklch.H);
  const linear = oklabToLinearRgb(lab);

  return {
    r: linearToSrgbChannel(linear.r),
    g: linearToSrgbChannel(linear.g),
    b: linearToSrgbChannel(linear.b),
    a: oklch.A,
  };
}

function parseRgbFunc(value) {
  // matches rgb(r g b) / rgb(r g b / a) / rgb(r, g, b) / rgb(r, g, b, a) — figma colors are 0-1
  const match = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,/\s]+([\d.]+%?))?\s*\)$/.exec(value);

  if (!match) return null;

  let alpha = 1;

  if (match[4] !== undefined) {
    const a = match[4];

    alpha = a.endsWith('%') ? parseFloat(a.slice(0, -1)) / 100 : parseFloat(a);
  }

  return {
    r: parseInt(match[1], 10) / 255,
    g: parseInt(match[2], 10) / 255,
    b: parseInt(match[3], 10) / 255,
    a: alpha,
  };
}

function parseColor(value) {
  const trimmed = value.trim();
  const oklch = parseOklch(trimmed);

  if (oklch) return oklchToRgb(oklch);

  const rgb = parseRgbFunc(trimmed);

  if (rgb) return rgb;

  // pass-through `transparent` and a few literals
  if (trimmed === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

  return null;
}

// ---------------------------------------------------------------------------
// classification — decide which figma variable bucket each var name belongs to
// ---------------------------------------------------------------------------

const PRIMITIVE_BUCKETS = [
  { prefix: 'color-', bucket: 'color', kind: 'color', hasModes: true },
  { prefix: 'radius-', bucket: 'radius', kind: 'dimension' },
  { prefix: 'spacing-', bucket: 'spacing', kind: 'dimension' },
  { prefix: 'sizing-', bucket: 'sizing', kind: 'dimension' },
  { prefix: 'opacity-', bucket: 'opacity', kind: 'number' },
  { prefix: 'font-size-', bucket: 'fontSize', kind: 'dimension' },
  { prefix: 'font-weight-', bucket: 'fontWeight', kind: 'number' },
  { prefix: 'line-height-', bucket: 'lineHeight', kind: 'number' },
  { prefix: 'letter-spacing-', bucket: 'letterSpacing', kind: 'number' },
  { prefix: 'border-width', bucket: 'borderWidth', kind: 'dimension' },
];

function classifyPrimitive(name) {
  for (const entry of PRIMITIVE_BUCKETS) {
    if (name === entry.prefix || name.startsWith(entry.prefix)) {
      let key = name === entry.prefix ? 'base' : name.slice(entry.prefix.length);

      // some prefixes do not end in '-' (e.g. `border-width`) so the remainder may begin with one
      if (key.startsWith('-')) key = key.slice(1);

      if (key === '') key = 'base';

      return { bucket: entry.bucket, kind: entry.kind, key, hasModes: !!entry.hasModes };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// main build
// ---------------------------------------------------------------------------

function buildPrimitives(baseLightVars, baseDarkVars, lightAllVars, darkAllVars) {
  const primitives = {
    color: {},
    radius: {},
    spacing: {},
    sizing: {},
    opacity: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    borderWidth: {},
  };

  for (const [name, rawValue] of Object.entries(baseLightVars)) {
    const classification = classifyPrimitive(name);

    if (!classification) continue;

    const { bucket, kind, key, hasModes } = classification;

    if (kind === 'color') {
      const lightResolved = resolveValue(rawValue, lightAllVars);
      const lightColor = parseColor(lightResolved);

      if (!lightColor) continue;

      const darkRaw = baseDarkVars[name] ?? rawValue;
      const darkResolved = resolveValue(darkRaw, darkAllVars);
      const darkColor = parseColor(darkResolved) ?? lightColor;

      primitives.color[key] = { light: lightColor, dark: darkColor };

      continue;
    }

    if (kind === 'dimension') {
      const resolved = resolveValue(rawValue, lightAllVars);
      const px = toPx(resolved);

      if (px === null) continue;

      primitives[bucket][hasModes ? key : key || 'base'] = px;

      continue;
    }

    if (kind === 'number') {
      const resolved = resolveValue(rawValue, lightAllVars);
      const num = unitlessNumber(resolved.trim());

      if (num === null) continue;

      primitives[bucket][key] = num;
    }
  }

  return primitives;
}

function buildComponentTokens(componentName, lightAllVars) {
  const cssPath = componentTokensPath(componentName);

  if (!fs.existsSync(cssPath)) return {};

  const content = cleanCss(fs.readFileSync(cssPath, 'utf-8'));
  const rootBlocks = findBlocks(content, ':root');
  const componentVars = Object.assign({}, ...rootBlocks.map(extractVariables));

  const out = {};
  const stripPrefix = `${componentName}-`;

  for (const [name, rawValue] of Object.entries(componentVars)) {
    const resolved = resolveValue(rawValue, { ...lightAllVars, ...componentVars });
    const trimmed = resolved.trim();
    const outKey = name.startsWith(stripPrefix) ? name.slice(stripPrefix.length) : name;

    const color = parseColor(trimmed);

    if (color) {
      out[outKey] = { kind: 'color', value: color, raw: rawValue };

      continue;
    }

    const px = toPx(trimmed);

    if (px !== null) {
      out[outKey] = { kind: 'number', value: px, raw: rawValue };

      continue;
    }

    // composite or non-numeric (e.g. font stack, multi-value padding) — keep resolved string
    out[outKey] = { kind: 'raw', value: trimmed, raw: rawValue };
  }

  return out;
}

function main() {
  const baseContent = cleanCss(fs.readFileSync(BASE_TOKENS_CSS, 'utf-8'));
  const baseLightVars = Object.assign({}, ...findBlocks(baseContent, ':root').map(extractVariables));
  const baseDarkVars = Object.assign({}, ...findBlocks(baseContent, '.dark').map(extractVariables));

  // pull in component :root vars so component-scoped composite values resolve correctly
  // (component vars never override base vars; the spread order ensures base wins on collision)
  const componentRootVars = {};

  for (const component of PILOT_COMPONENTS) {
    const cssPath = componentTokensPath(component);

    if (!fs.existsSync(cssPath)) continue;

    const content = cleanCss(fs.readFileSync(cssPath, 'utf-8'));
    const blocks = findBlocks(content, ':root');

    Object.assign(componentRootVars, ...blocks.map(extractVariables));
  }

  const lightAllVars = { ...componentRootVars, ...baseLightVars };
  const darkAllVars = { ...lightAllVars, ...baseDarkVars };

  const primitives = buildPrimitives(baseLightVars, baseDarkVars, lightAllVars, darkAllVars);

  const components = {};

  for (const component of PILOT_COMPONENTS) {
    components[component] = buildComponentTokens(component, lightAllVars);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    primitives,
    components,
  };

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2), 'utf-8');

  // summary
  console.log(`primitives.color: ${Object.keys(primitives.color).length}`);
  console.log(`primitives.radius: ${Object.keys(primitives.radius).length}`);
  console.log(`primitives.spacing: ${Object.keys(primitives.spacing).length}`);
  console.log(`primitives.sizing: ${Object.keys(primitives.sizing).length}`);
  console.log(`primitives.fontSize: ${Object.keys(primitives.fontSize).length}`);
  console.log(`primitives.fontWeight: ${Object.keys(primitives.fontWeight).length}`);
  console.log(`primitives.lineHeight: ${Object.keys(primitives.lineHeight).length}`);
  console.log(`primitives.letterSpacing: ${Object.keys(primitives.letterSpacing).length}`);
  console.log(`primitives.borderWidth: ${Object.keys(primitives.borderWidth).length}`);
  console.log(`primitives.opacity: ${Object.keys(primitives.opacity).length}`);

  for (const component of PILOT_COMPONENTS) {
    console.log(`components.${component}: ${Object.keys(components[component]).length}`);
  }

  console.log(`output: ${OUTPUT_JSON}`);
}

main();
