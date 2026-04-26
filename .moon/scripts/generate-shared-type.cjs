const fs = require('fs');
const path = require('path');

const toPascalCase = (str) => {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const typeTemplateMap = {
  type: 'type-template.txt',
}

const typeDirectoryMap = {
  type: 'types',
}

const readTemplate = (type) => {
  const templatePath = path.join(__dirname, typeTemplateMap[type]);

  return fs.readFileSync(templatePath, 'utf8');
};

const generateContent = (typeName, template) => {
  const pascalCaseName = toPascalCase(typeName);

  return template.replace(/\$\$NAME\$\$/g, pascalCaseName);
};

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const writeFile = (filePath, content, type) => {
  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists at ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`Generated ${type} file: ${filePath}`);
};

const main = () => {
  const args = process.argv.slice(2);

  console.error(`Args: ${args[0]}, ${args[1]}`);

  const type = args[0] || '???';

  if (args.length === 1) {
    console.error(`Usage: moon global:generate-${type} <${type}-name>`);
    console.error(`Example: moon global:generate-${type} -- ${type}-name`);

    process.exit(1);
  }

  const typeName = args[1];
  const pascalCaseName = toPascalCase(typeName);

  console.log(`Generating ${type}: ${typeName} -> ${pascalCaseName}`);

  try {
    const template = readTemplate(type);
    const content = generateContent(typeName, template);
    const outputDir = path.join(process.cwd(), 'projects', 'shared-types', 'src', typeDirectoryMap[type]);

    ensureDirectoryExists(outputDir);

    const filePath = path.join(outputDir, `${typeName}.ts`);

    writeFile(filePath, content, type);

    console.log(`${type} generation completed successfully!`);
  } catch (error) {
    console.error(`Error generating ${type}:`, error.message);

    process.exit(1);
  }
};

main();
