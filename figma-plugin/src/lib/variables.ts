import { COLLECTION_NAME, type ColorToken, tokens, type Rgba } from './tokens';
import { removeCollectionByName } from './idempotency';

/** path-style figma variable name (e.g. `primitives/color/primary`) */
type VarName = string;

/** result of generating the design-system variable collection */
export type GeneratedVariables = {
  collection: VariableCollection;
  lightModeId: string;
  darkModeId: string;
  /** lookup of every variable created, keyed by figma variable name */
  byName: Map<VarName, Variable>;
};

function colorPath(key: string): VarName {
  return `primitives/color/${key}`;
}

function primitivePath(bucket: string, key: string): VarName {
  return `primitives/${bucket}/${key}`;
}

function componentPath(component: string, key: string): VarName {
  return `components/${component}/${key}`;
}

function setColor(variable: Variable, modeId: string, value: Rgba): void {
  variable.setValueForMode(modeId, value);
}

function createColorVariable(
  collection: VariableCollection,
  lightModeId: string,
  darkModeId: string,
  name: VarName,
  token: ColorToken
): Variable {
  const variable = figma.variables.createVariable(name, collection, 'COLOR');

  setColor(variable, lightModeId, token.light);
  setColor(variable, darkModeId, token.dark);

  return variable;
}

function createFloatVariable(
  collection: VariableCollection,
  modeIds: string[],
  name: VarName,
  value: number
): Variable {
  const variable = figma.variables.createVariable(name, collection, 'FLOAT');

  for (const modeId of modeIds) {
    variable.setValueForMode(modeId, value);
  }

  return variable;
}

function setAliasForAllModes(target: Variable, source: Variable, modeIds: string[]): void {
  const alias = figma.variables.createVariableAlias(source);

  for (const modeId of modeIds) {
    target.setValueForMode(modeId, alias);
  }
}

/** parse the `raw` field of a component token to detect a single `var(--X)` alias to a base variable */
function parseAliasTarget(raw: string): { name: string } | null {
  const trimmed = raw.trim();
  const match = /^var\(--([\w-]+)\)$/.exec(trimmed);

  if (!match) return null;

  return { name: match[1] };
}

/**
 * map a base css var name (e.g. `color-primary`, `radius-sm`) to its figma variable path so we
 * can resolve a component-scoped alias back to the primitive variable it references
 */
function aliasNameToVarPath(cssName: string): VarName | null {
  if (cssName.startsWith('color-')) return colorPath(cssName.slice('color-'.length));
  if (cssName.startsWith('radius-')) return primitivePath('radius', cssName.slice('radius-'.length));
  if (cssName.startsWith('spacing-')) return primitivePath('spacing', cssName.slice('spacing-'.length));
  if (cssName.startsWith('sizing-')) return primitivePath('sizing', cssName.slice('sizing-'.length));
  if (cssName.startsWith('font-size-')) return primitivePath('fontSize', cssName.slice('font-size-'.length));

  if (cssName.startsWith('font-weight-')) {
    return primitivePath('fontWeight', cssName.slice('font-weight-'.length));
  }

  if (cssName.startsWith('line-height-')) {
    return primitivePath('lineHeight', cssName.slice('line-height-'.length));
  }

  if (cssName.startsWith('letter-spacing-')) {
    return primitivePath('letterSpacing', cssName.slice('letter-spacing-'.length));
  }

  if (cssName === 'border-width') return primitivePath('borderWidth', 'base');

  if (cssName.startsWith('border-width-')) {
    return primitivePath('borderWidth', cssName.slice('border-width-'.length));
  }

  if (cssName.startsWith('opacity-')) return primitivePath('opacity', cssName.slice('opacity-'.length));

  return null;
}

/** create the full design-system variable collection from the generated tokens.json */
export function generateVariables(): GeneratedVariables {
  // idempotent re-run: nuke the previous collection if present
  removeCollectionByName(COLLECTION_NAME);

  const collection = figma.variables.createVariableCollection(COLLECTION_NAME);

  collection.renameMode(collection.modes[0].modeId, 'light');

  const lightModeId = collection.modes[0].modeId;
  const darkModeId = collection.addMode('dark');
  const allModes = [lightModeId, darkModeId];

  const byName = new Map<VarName, Variable>();

  // primitives — colors (per-mode)
  for (const [key, token] of Object.entries(tokens.primitives.color)) {
    const name = colorPath(key);
    const v = createColorVariable(collection, lightModeId, darkModeId, name, token);

    byName.set(name, v);
  }

  // primitives — numeric (single value across both modes)
  const numericBuckets: [
    (
      | 'radius'
      | 'spacing'
      | 'sizing'
      | 'fontSize'
      | 'fontWeight'
      | 'lineHeight'
      | 'letterSpacing'
      | 'borderWidth'
      | 'opacity'
    ),
    Record<string, number>,
  ][] = [
    ['radius', tokens.primitives.radius],
    ['spacing', tokens.primitives.spacing],
    ['sizing', tokens.primitives.sizing],
    ['fontSize', tokens.primitives.fontSize],
    ['fontWeight', tokens.primitives.fontWeight],
    ['lineHeight', tokens.primitives.lineHeight],
    ['letterSpacing', tokens.primitives.letterSpacing],
    ['borderWidth', tokens.primitives.borderWidth],
    ['opacity', tokens.primitives.opacity],
  ];

  for (const [bucket, values] of numericBuckets) {
    for (const [key, value] of Object.entries(values)) {
      const name = primitivePath(bucket, key);
      const v = createFloatVariable(collection, allModes, name, value);

      byName.set(name, v);
    }
  }

  // component-scoped — alias to primitives where the raw value is a single var(--X), else create a raw variable
  for (const [component, componentTokens] of Object.entries(tokens.components)) {
    for (const [key, token] of Object.entries(componentTokens)) {
      // skip composite/raw-string tokens entirely; component generators apply those statically
      if (token.kind === 'raw') continue;

      const name = componentPath(component, key);
      const aliasTarget = parseAliasTarget(token.raw);
      const aliasPath = aliasTarget ? aliasNameToVarPath(aliasTarget.name) : null;
      const sourceVar = aliasPath ? byName.get(aliasPath) : undefined;

      if (sourceVar && sourceVar.resolvedType === (token.kind === 'color' ? 'COLOR' : 'FLOAT')) {
        const variable = figma.variables.createVariable(name, collection, token.kind === 'color' ? 'COLOR' : 'FLOAT');

        setAliasForAllModes(variable, sourceVar, allModes);
        byName.set(name, variable);

        continue;
      }

      // no resolvable alias — create a literal variable with the resolved value
      if (token.kind === 'color') {
        const variable = figma.variables.createVariable(name, collection, 'COLOR');

        for (const modeId of allModes) {
          variable.setValueForMode(modeId, token.value);
        }

        byName.set(name, variable);

        continue;
      }

      // numeric literal
      const variable = createFloatVariable(collection, allModes, name, token.value);

      byName.set(name, variable);
    }
  }

  return { collection, lightModeId, darkModeId, byName };
}

/** look up a primitive color variable by its key in tokens.primitives.color (e.g. "primary", "bg-app") */
export function getColorVar(vars: GeneratedVariables, key: string): Variable | undefined {
  return vars.byName.get(colorPath(key));
}

/** look up a primitive numeric variable by bucket + key (e.g. "radius", "sm") */
export function getPrimitiveVar(vars: GeneratedVariables, bucket: string, key: string): Variable | undefined {
  return vars.byName.get(primitivePath(bucket, key));
}

/** look up a component-scoped variable by component + key (e.g. "button", "bg") */
export function getComponentVar(vars: GeneratedVariables, component: string, key: string): Variable | undefined {
  return vars.byName.get(componentPath(component, key));
}
