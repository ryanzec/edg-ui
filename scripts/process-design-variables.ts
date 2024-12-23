import * as fs from 'fs';

const FIGMA_VARIABLES_JSON_PATH = './artifacts/figma-variables.json';
enum TemplatePath {
  CSS = './scripts/templates/app.css.template',
  TAILWIND_CONFIG = './scripts/templates/tailwind.config.js.template',
}
enum OutputPath {
  CSS = './src/app.css',
  TAILWIND_CONFIG = './tailwind.config.js',
}
enum ReplaceKey {
  LIGHT_CSS_VARIABLES = '%LIGHT_COLOR_VARIABLES%',
  DARK_CSS_VARIABLES = '%DARK_COLOR_VARIABLES%',
  TAILWIND_COLOR_VARIABLES = '%COLOR_VARIABLES%',
}

type ColorVariable = {
  name: string;
  type: string;
  isAlias: boolean;
  value: string;
};

type ColorMode = {
  name: string;
  variables: ColorVariable[];
};

type Collection = {
  name: string;
  modes: ColorMode[];
};

type ConfigData = { collections: Collection[] };

const tailwindVariables: { colors: string[] } = { colors: [] };

const generateColorCssVariables = (data: ConfigData): string => {
  const colorCollection = data.collections.find((collection) => collection.name === 'colors');

  if (!colorCollection) {
    throw new Error('colors collection not found');
  }

  const cssLightVariables: string[] = [];
  const cssDarkVariables: string[] = [];

  for (const mode of colorCollection.modes) {
    for (const variable of mode.variables) {
      let cssVariableName = variable.name
        .replace(/\//g, '-')
        .replace('-base', '')
        .replace('-color', '')
        .replace('misc-', '');

      if (cssVariableName.endsWith('-on')) {
        cssVariableName = cssVariableName.split('-').reverse().join('-');
      }

      // we only need to process this once for tailwind
      if (mode.name === 'light') {
        tailwindVariables.colors.push(cssVariableName);
      }

      const cssVariable = `    --color-${cssVariableName}: ${variable.value};`;

      (mode.name === 'light' ? cssLightVariables : cssDarkVariables).push(cssVariable);
    }
  }

  let cssTemplate = fs.readFileSync(TemplatePath.CSS, 'utf8');

  cssTemplate = cssTemplate
    .replace(ReplaceKey.LIGHT_CSS_VARIABLES, cssLightVariables.join('\n'))
    .replace(ReplaceKey.DARK_CSS_VARIABLES, cssDarkVariables.join('\n'));

  return cssTemplate;
};

const writeTailwindConfigurationFile = () => {
  const colorsThemeClasses: string[] = [];

  tailwindVariables.colors.forEach((color) => {
    const colorKey = color.includes('-') ? `'${color}'` : color;

    colorsThemeClasses.push(`      ${colorKey}: 'var(--color-${color})',`);
  });

  let tailwindConfigTemplate = fs.readFileSync(TemplatePath.TAILWIND_CONFIG, 'utf8');

  tailwindConfigTemplate = tailwindConfigTemplate.replace(
    ReplaceKey.TAILWIND_COLOR_VARIABLES,
    colorsThemeClasses.join('\n'),
  );

  fs.writeFileSync(OutputPath.TAILWIND_CONFIG, tailwindConfigTemplate);
};

try {
  const rawData = fs.readFileSync(FIGMA_VARIABLES_JSON_PATH, 'utf8');
  const data = JSON.parse(rawData);
  const cssOutput = generateColorCssVariables(data);

  fs.writeFileSync(OutputPath.CSS, cssOutput);

  writeTailwindConfigurationFile();

  console.log('design variables processed successfully!');
} catch (error) {
  console.error('error:', error);
  process.exit(1);
}
