const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const sourceDir = path.join(repoRoot, '.claude/rules');
const claudeMdFile = path.join(repoRoot, '.claude/CLAUDE.md');
const targetDir = path.join(repoRoot, '.cursor/rules');
const commandsSourceDir = path.join(repoRoot, '.claude/commands');
const commandsTargetDir = path.join(repoRoot, '.cursor/commands');

const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?/;

const parseFrontmatter = (content) => {
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: content };
  }

  return { frontmatter: match[1], body: content.slice(match[0].length) };
};

const transformFrontmatter = (frontmatter) => {
  let alwaysApply = true;

  if (frontmatter) {
    const lines = frontmatter.split('\n').filter((line) => !line.trim().startsWith('#'));

    for (const line of lines) {
      const match = line.match(/^\s*alwaysApply\s*:\s*(true|false)\s*$/);

      if (match) {
        alwaysApply = match[1] === 'true';
        break;
      }
    }
  }

  return `alwaysApply: ${alwaysApply}`;
};

const transformBody = (body) => {
  return body.replace(/\.claude\/rules/g, '.cursor/rules');
};

const syncFile = (sourceFile) => {
  const relativePath = path.relative(sourceDir, sourceFile);
  const targetRelativePath = relativePath.replace(/\.md$/, '.mdc');
  const targetFile = path.join(targetDir, targetRelativePath);
  const targetFileDir = path.dirname(targetFile);

  if (!fs.existsSync(targetFileDir)) {
    fs.mkdirSync(targetFileDir, { recursive: true });
  }

  const content = fs.readFileSync(sourceFile, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  const transformedFrontmatter = transformFrontmatter(frontmatter);
  const transformedBody = transformBody(body);
  const output = `---\n${transformedFrontmatter}\n---\n${transformedBody}`;

  fs.writeFileSync(targetFile, output, 'utf8');
  console.log(`synced: ${targetRelativePath}`);
};

const getAllFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
};

const clearDirectory = (dir, label) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  fs.mkdirSync(dir, { recursive: true });
  console.log(`cleared: ${label}`);
};

const claudeMdContent = fs.readFileSync(claudeMdFile, 'utf8');
const agentMdcFile = path.join(targetDir, 'agent.mdc');

clearDirectory(targetDir, '.cursor/rules');

fs.writeFileSync(agentMdcFile, `---\nalwaysApply: true\n---\n${claudeMdContent}`, 'utf8');
console.log(`synced: agent.mdc`);

const sourceFiles = getAllFiles(sourceDir);

for (const sourceFile of sourceFiles) {
  syncFile(sourceFile);
}

console.log(`\ndone: synced ${sourceFiles.length} file(s) from .claude/rules to .cursor/rules`);

if (fs.existsSync(commandsSourceDir)) {
  clearDirectory(commandsTargetDir, '.cursor/commands');

  const commandFiles = getAllFiles(commandsSourceDir);

  for (const commandFile of commandFiles) {
    const relativePath = path.relative(commandsSourceDir, commandFile);
    const targetFile = path.join(commandsTargetDir, relativePath);
    const targetFileDir = path.dirname(targetFile);

    if (!fs.existsSync(targetFileDir)) {
      fs.mkdirSync(targetFileDir, { recursive: true });
    }

    fs.copyFileSync(commandFile, targetFile);
    console.log(`synced: commands/${relativePath}`);
  }

  console.log(`\ndone: synced ${commandFiles.length} file(s) from .claude/commands to .cursor/commands`);
}
