const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const sourceDir = path.join(repoRoot, '.claude/rules');
const claudeMdFile = path.join(repoRoot, '.claude/CLAUDE.md');
const targetFile = path.join(repoRoot, '.gemini/GEMINI.md');

const frontmatterRegex = /^---\n[\s\S]*?\n---\n?/;

const stripFrontmatter = (content) => {
  return content.replace(frontmatterRegex, '');
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

const claudeMdContent = fs.readFileSync(claudeMdFile, 'utf8').trim();
const sourceFiles = getAllFiles(sourceDir);
const sections = [`<!-- source: .claude/CLAUDE.md -->\n${claudeMdContent}`];

for (const sourceFile of sourceFiles) {
  const relativePath = path.relative(sourceDir, sourceFile);
  const content = fs.readFileSync(sourceFile, 'utf8');
  const body = stripFrontmatter(content).trim();

  if (body) {
    sections.push(`<!-- rules: ${relativePath} -->\n${body}`);
  }
}

const output = sections.join('\n\n') + '\n';

fs.writeFileSync(targetFile, output, 'utf8');
console.log(`done: synced ${sourceFiles.length} file(s) from .claude/rules to .gemini/GEMINI.md`);
