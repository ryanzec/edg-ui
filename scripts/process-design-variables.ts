import * as fs from 'fs';
// import { stringUtils } from '../src/lib/utils/string';

const FIGMA_VARIABLES_JSON_PATH = './artifacts/figma-variables.json';
const BASE_SIZE = 16;

enum TemplatePath {
  CSS = './scripts/templates/app.css.template',
  // TAILWIND_CONFIG = './scripts/templates/tailwind.config.js.template',
}
enum OutputPath {
  CSS = './src/app.css',
  // TAILWIND_CONFIG = './tailwind.config.js',
}
enum ReplaceKey {
  LIGHT_CSS_VARIABLES = '%LIGHT_COLOR_VARIABLES%',
  DARK_CSS_VARIABLES = '%DARK_COLOR_VARIABLES%',
  SPACING_CSS_VARIABLES = '%SPACING_VARIABLES%',
  BORDER_RADIUS_CSS_VARIABLES = '%BORDER_RADIUS_VARIABLES%',
  SIZE_CSS_VARIABLES = '%SIZE_VARIABLES%',
  LINE_HEIGHT_CSS_VARIABLES = '%LINE_HEIGHT_VARIABLES%',
  Z_INDEX_CSS_VARIABLES = '%Z_INDEX_VARIABLES%',
  OPACITY_CSS_VARIABLES = '%OPACITY_VARIABLES%',
  // TAILWIND_COLOR_VARIABLES = '%TAILWIND_COLOR_VARIABLES%',
  // TAILWIND_SPACING_VARIABLES = '%TAILWIND_SPACING_VARIABLES%',
  // TAILWIND_BORDER_RADIUS_VARIABLES = '%TAILWIND_BORDER_RADIUS_VARIABLES%',
  // TAILWIND_SIZE_VARIABLES = '%TAILWIND_SIZE_VARIABLES%',
  // TAILWIND_LINE_HEIGHT_VARIABLES = '%TAILWIND_LINE_HEIGHT_VARIABLES%',
  // TAILWIND_Z_INDEX_VARIABLES = '%TAILWIND_Z_INDEX_VARIABLES%',
  // TAILWIND_OPACITY_VARIABLES = '%TAILWIND_OPACITY_VARIABLES%',
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
  Z_INDEX = 'z',
  OPACITY = 'opacity',
}

const sizeCollections: VariableCollection[] = [
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
  [VariableCollection.Z_INDEX]: 'z-index',
  [VariableCollection.OPACITY]: 'opacity',
};

// type TailwindVariables = {
//   colors: string[];
//   spacing: string[];
//   borderRadius: string[];
//   fontSize: string[];
//   lineHeight: string[];
//   zIndex: string[];
//   opacity: string[];
// };

// const variableCollectionTailwindVariableKeyMap: Record<VariableCollection, keyof TailwindVariables> = {
//   [VariableCollection.COLOR]: 'colors',
//   [VariableCollection.SPACE]: 'spacing',
//   [VariableCollection.BORDER_RADIUS]: 'borderRadius',
//   [VariableCollection.FONT_SIZE]: 'fontSize',
//   [VariableCollection.LINE_HEIGHT]: 'lineHeight',
//   [VariableCollection.Z_INDEX]: 'zIndex',
//   [VariableCollection.OPACITY]: 'opacity',
// };
//
// const tailwindVariables: TailwindVariables = {
//   colors: [],
//   spacing: [],
//   borderRadius: [],
//   fontSize: [],
//   lineHeight: [],
//   zIndex: [],
//   opacity: [],
// };

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

  const lightCssVariables: string[] = [];
  const darkCssVariables: string[] = [];
  const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.COLOR];

  for (const mode of colorCollection.modes) {
    for (const variable of mode.variables) {
      let cssVariableName = cleanColorVariableName(variable.name);

      // we only need to process this once for tailwind
      // if (mode.name === 'light') {
      //   tailwindVariables.colors.push(cssVariableName);
      // }

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
  const cssVariables: string[] = [];

  for (const variable of collection.modes[0].variables) {
    const variableName = cleanVariableName(variable.name);
    // const tailwindVariableKey = variableCollectionTailwindVariableKeyMap[variableCollection];

    // if (tailwindVariableKey) {
    //   tailwindVariables[tailwindVariableKey as keyof typeof tailwindVariables].push(variableName);
    // }

    const variableUnit = sizeCollections.includes(variableCollection) ? 'rem' : '';
    let variableRawValue = sizeCollections.includes(variableCollection)
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
  const sizeCssVariables = buildGeneralCssVariables(data, VariableCollection.FONT_SIZE);
  const lineHeightCssVariables = buildGeneralCssVariables(data, VariableCollection.LINE_HEIGHT);
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
    .replace(ReplaceKey.SIZE_CSS_VARIABLES, sizeCssVariables.join('\n'));

  fs.writeFileSync(OutputPath.CSS, cssTemplate);
};

// const buildTailwindVariableKey = (cssVariableName: string): string => {
//   return cssVariableName.includes('-') || stringUtils.startsWithNumber(cssVariableName)
//     ? `'${cssVariableName}'`
//     : cssVariableName;
// };
//
// const writeTailwindConfigurationFile = () => {
//   const colorsThemeClasses: string[] = [];
//
//   tailwindVariables.colors.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.COLOR];
//
//     colorsThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const spacingThemeClasses: string[] = [];
//
//   tailwindVariables.spacing.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.SPACE];
//
//     spacingThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const borderRadiusThemeClasses: string[] = [];
//
//   tailwindVariables.borderRadius.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.BORDER_RADIUS];
//
//     borderRadiusThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const sizeThemeClasses: string[] = [];
//
//   tailwindVariables.fontSize.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.FONT_SIZE];
//
//     sizeThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const lineHeightThemeClasses: string[] = [];
//
//   tailwindVariables.lineHeight.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.LINE_HEIGHT];
//
//     lineHeightThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const zIndexThemeClasses: string[] = [];
//
//   tailwindVariables.zIndex.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.Z_INDEX];
//
//     zIndexThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   const opacityThemeClasses: string[] = [];
//
//   tailwindVariables.opacity.forEach((cssVariableName) => {
//     const key = buildTailwindVariableKey(cssVariableName);
//     const cssPrefix = variableCollectionCssVariablePrefixMap[VariableCollection.OPACITY];
//
//     opacityThemeClasses.push(`      ${key}: 'var(--${cssPrefix}-${cssVariableName})',`);
//   });
//
//   let tailwindConfigTemplate = fs.readFileSync(TemplatePath.TAILWIND_CONFIG, 'utf8');
//
//   tailwindConfigTemplate = tailwindConfigTemplate
//     .replace(ReplaceKey.TAILWIND_COLOR_VARIABLES, colorsThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_SPACING_VARIABLES, spacingThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_BORDER_RADIUS_VARIABLES, borderRadiusThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_LINE_HEIGHT_VARIABLES, lineHeightThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_Z_INDEX_VARIABLES, zIndexThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_OPACITY_VARIABLES, opacityThemeClasses.join('\n'))
//     .replace(ReplaceKey.TAILWIND_SIZE_VARIABLES, sizeThemeClasses.join('\n'));
//
//   fs.writeFileSync(OutputPath.TAILWIND_CONFIG, tailwindConfigTemplate);
// };

try {
  writeCssFile();
  // writeTailwindConfigurationFile();

  console.log('design variables processed successfully!');
} catch (error) {
  console.error('error:', error);
  process.exit(1);
}
