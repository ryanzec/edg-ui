const { execSync } = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2).join(' ');

const validProjects = [
  'customer-portal',
  'internal-portal',
  'shared-ui',
];

const validGenerateTypes = [
  'application',
  'class',
  'component',
  'config',
  'directive',
  'enum',
  'guard',
  'interceptor',
  'interface',
  'library',
  // we don't use modules anymore (modern angular recommends against creating actual modules)
  // 'module',
  'pipe',
  'resolver',
  'service',
  'service-worker',
  'web-worker',
];

const autoSkipGenerateTypes= [
  'application',
  'library',
];

// we use the module nomeclature though it is only being used for folders (modern angular recommends against creating
// actual modules)
const forceModuleSelectionTypes = [
  'component',
  'directive',
  'guard',
  'interceptor',
  'pipe',
  'resolver',
  'service',
];

const forceProjectSelectionTypes = [
  'class',
  'component',
  'config',
  'directive',
  'enum',
  'guard',
  'interceptor',
  'interface',
  'pipe',
  'resolver',
  'service',
  'service-worker',
  'web-worker',
];

const duplicateNameAsDirectory = [
  'pipe',
  'service',
  'directive',
  'guard',
  'interceptor',
];

const addTypeToDirectory = [
  'pipe',
  'guard',
];

const typeSuffixMap = {
  'directive': 'directive',
};

const runCommand = (command, args = []) => {
  try {
    const fullCommand = `${command}${args.length > 0 ? ` ${args.join(' ')}` : ''}`;

    console.log(`Executing: ${fullCommand}`);

    execSync(fullCommand, { stdio: 'inherit' });

    console.log('Command executed successfully.');
  } catch (error) {
    console.error('Command failed:', error.message);
    process.exit(1);
  } finally {
    readline.close();
  }
};

// Promisify readline.question to use with async/await
const question = (query) => new Promise((resolve) => {
  readline.question(query, resolve);
});

const main = async () => {
  const generateType = await question(`Enter what you want to generate (e.g., 'component, service, etc.'): `);

  if (generateType === 'interface') {
    console.error('use `moon :generate-type` instead');

    process.exit(1);
  }

  if (validGenerateTypes.includes(generateType) === false) {
    console.error(`Invalid generate type: ${generateType}`);

    process.exit(1);
  }

  let command = `ng generate ${generateType} ${args}`;

  if (autoSkipGenerateTypes.includes(generateType)) {
    command += ' --skip-install';
  }

  if (forceProjectSelectionTypes.includes(generateType)) {
    const projectName = await question(`Enter project name: `);

    if (validProjects.includes(projectName) === false) {
      console.error(`Invalid project: ${projectName}`);
      console.error(`Valid projects: ${validProjects.join(', ')}`);

      process.exit(1);
    }

    command += ` --project ${projectName}`;
  }

  let moduleName = '';

  if (forceModuleSelectionTypes.includes(generateType)) {
    moduleName = await question(`Enter module / feature name: `);

    if (!moduleName) {
      console.error('Module name is required');

      process.exit(1);
    }
  }

  let itemName = await question(`Enter ${generateType} name: `);

  if (!!typeSuffixMap[generateType]) {
    itemName = `${itemName}-${typeSuffixMap[generateType]}`;
  }

  if (duplicateNameAsDirectory.includes(generateType)) {
    const directorySuffix = addTypeToDirectory.includes(generateType) ? `-${generateType}` : '';

    itemName = `${itemName}${directorySuffix}/${itemName}`;
  }

  if (moduleName) {
    itemName = `${moduleName}/${itemName}`;
  }

  runCommand(command, [itemName]);
};

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
