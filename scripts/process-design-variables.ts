import * as fs from 'fs';

const FIGMA_VARIABLES_JSON_PATH = './artifacts/figma-variables.json';
const BASE_SIZE = 16;

enum TemplatePath {
  CSS = './scripts/templates/app.css.template',
}
enum OutputPath {
  CSS = './src/app.css',
}
enum ReplaceKey {
  LIGHT_CSS_VARIABLES = '%LIGHT_COLOR_VARIABLES%',
  DARK_CSS_VARIABLES = '%DARK_COLOR_VARIABLES%',
  SPACING_CSS_VARIABLES = '%SPACING_VARIABLES%',
  BORDER_RADIUS_CSS_VARIABLES = '%BORDER_RADIUS_VARIABLES%',
  FONT_SIZE_CSS_VARIABLES = '%FONT_SIZE_VARIABLES%',
  LINE_HEIGHT_CSS_VARIABLES = '%LINE_HEIGHT_VARIABLES%',
  LETTER_SPACING_CSS_VARIABLES = '%LETTER_SPACING_VARIABLES%',
  Z_INDEX_CSS_VARIABLES = '%Z_INDEX_VARIABLES%',
  OPACITY_CSS_VARIABLES = '%OPACITY_VARIABLES%',
}

type AliasVariable = {
  collection: string;
  name: string;
};

type TypographyVariable = {
  // this need to be in pixel in figma
  fontSize: number;

  fontFamily: string;
  fontWeight: string;

  // this need to be in pixel in figma
  lineHeight: number;

  // this needs to be in pixel in figma
  letterSpacing: number;
};

type Variable = {
  name: string;
  type: string;
  isAlias: boolean;
  value: string | number | AliasVariable | TypographyVariable;
};

type Mode = {
  name: string;
  variables: Variable[];
};

type Collection = {
  name: string;
  modes: Mode[];
};

type ConfigData = { collections: Collection[] };

enum VariableCollection {
  COLOR = 'color',
  SPACE = 'space',
  BORDER_RADIUS = 'border-radius',
  FONT_SIZE = 'font-size',
  LINE_HEIGHT = 'line-height',
  LETTER_SPACING = 'letter-spacing',
  Z_INDEX = 'z',
  OPACITY = 'opacity',
}

const remSizeCollections: VariableCollection[] = [
  VariableCollection.SPACE,
  VariableCollection.BORDER_RADIUS,
  VariableCollection.FONT_SIZE,
  VariableCollection.LINE_HEIGHT,
  VariableCollection.BORDER_RADIUS,
];

const variableCollectionCssVariablePrefixMap: Record<VariableCollection, string> = {
  [VariableCollection.COLOR]: 'color',
  [VariableCollection.SPACE]: 'spacing',
  [VariableCollection.BORDER_RADIUS]: 'radius',
  [VariableCollection.FONT_SIZE]: 'text',
  [VariableCollection.LINE_HEIGHT]: 'line-height',
  [VariableCollection.LETTER_SPACING]: 'tracking',
  [VariableCollection.Z_INDEX]: 'z-index',
  [VariableCollection.OPACITY]: 'opacity',
};

const cleanVariableName = (variableName: string): string => variableName.replace(/\//g, '-');

const cleanColorVariableName = (variableName: string): string => {
  let cleanName = variableName.replace(/\//g, '-').replace('-base', '').replace('-color', '').replace('misc-', '');

  if (cleanName.endsWith('-on')) {
    cleanName = cleanName.split('-').reverse().join('-');
  }

  return cleanName;
};

const buildColorCssVariables = (data: ConfigData): [string[], string[]] => {
  const colorCollection = data.collections.find((collection) => collection.name === VariableCollection.COLOR);

  if (!colorCollection) {
    throw new Error('colors collection not found');
  }

  const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.COLOR];

  // this default value basically reset the classes for any variable type we dynamically generate to avoid the
  // default ones from being used and limit ourselves to just the ones we define
  const lightCssVariables: string[] = [`  --${cssPrefix}-*: initial;`];
  const darkCssVariables: string[] = [];

  for (const mode of colorCollection.modes) {
    for (const variable of mode.variables) {
      let cssVariableName = cleanColorVariableName(variable.name);
      const cssVariable = `  --${cssPrefix}-${cssVariableName}: ${variable.value};`;

      (mode.name === 'light' ? lightCssVariables : darkCssVariables).push(cssVariable);
    }
  }

  return [lightCssVariables, darkCssVariables];
};

const buildGeneralCssVariables = (data: ConfigData, variableCollection: VariableCollection): string[] => {
  const collection = data.collections.find((collection) => collection.name === variableCollection);

  if (!collection) {
    throw new Error(`${collection} collection not found`);
  }

  if (collection.modes.length !== 1) {
    throw new Error(`${collection} collection should only have one mode`);
  }

  const cssPrefix = variableCollectionCssVariablePrefixMap[variableCollection];

  // this default value basically reset the classes for any variable type we dynamically generate to avoid the
  // default ones from being used and limit ourselves to just the ones we define
  const cssVariables: string[] = [`  --${cssPrefix}-*: initial;`];

  for (const variable of collection.modes[0].variables) {
    const variableName = cleanVariableName(variable.name);
    const variableUnit = remSizeCollections.includes(variableCollection) ? 'rem' : '';
    let variableRawValue = remSizeCollections.includes(variableCollection)
      ? (variable.value as number) / BASE_SIZE
      : (variable.value as number);

    if (variableCollection === VariableCollection.OPACITY) {
      variableRawValue /= 100;
    }

    cssVariables.push(`  --${cssPrefix}-${variableName}: ${variableRawValue}${variableUnit};`);
  }

  return cssVariables;
};

const writeCssFile = () => {
  const rawData = fs.readFileSync(FIGMA_VARIABLES_JSON_PATH, 'utf8');
  const data = JSON.parse(rawData);
  const [lightCssVariables, darkCssVariables] = buildColorCssVariables(data);
  const spacingCssVariables = buildGeneralCssVariables(data, VariableCollection.SPACE);
  const borderRadiusCssVariables = buildGeneralCssVariables(data, VariableCollection.BORDER_RADIUS);
  const fontSizeCssVariables = buildGeneralCssVariables(data, VariableCollection.FONT_SIZE);
  const lineHeightCssVariables = buildGeneralCssVariables(data, VariableCollection.LINE_HEIGHT);
  const letterSpacingCssVariables = buildGeneralCssVariables(data, VariableCollection.LETTER_SPACING);
  const zIndexCssVariables = buildGeneralCssVariables(data, VariableCollection.Z_INDEX);
  const opacityCssVariables = buildGeneralCssVariables(data, VariableCollection.OPACITY);

  let cssTemplate = fs.readFileSync(TemplatePath.CSS, 'utf8');

  cssTemplate = cssTemplate
    .replace(ReplaceKey.LIGHT_CSS_VARIABLES, lightCssVariables.join('\n'))
    .replace(ReplaceKey.DARK_CSS_VARIABLES, darkCssVariables.join('\n'))
    .replace(ReplaceKey.SPACING_CSS_VARIABLES, spacingCssVariables.join('\n'))
    .replace(ReplaceKey.BORDER_RADIUS_CSS_VARIABLES, borderRadiusCssVariables.join('\n'))
    .replace(ReplaceKey.LINE_HEIGHT_CSS_VARIABLES, lineHeightCssVariables.join('\n'))
    .replace(ReplaceKey.Z_INDEX_CSS_VARIABLES, zIndexCssVariables.join('\n'))
    .replace(ReplaceKey.OPACITY_CSS_VARIABLES, opacityCssVariables.join('\n'))
    .replace(ReplaceKey.LETTER_SPACING_CSS_VARIABLES, letterSpacingCssVariables.join('\n'))
    .replace(ReplaceKey.FONT_SIZE_CSS_VARIABLES, fontSizeCssVariables.join('\n'));

  fs.writeFileSync(OutputPath.CSS, cssTemplate);
};

try {
  writeCssFile();

  console.log('design variables processed successfully!');
} catch (error) {
  console.error('error:', error);
  process.exit(1);
}
