'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PROJECTS_ROOT = path.join(REPO_ROOT, 'projects');
const SCREENSHOTS_DIR_NAME = '__screenshots__';
const VITEST_ATTACHMENTS_DIR = path.join(REPO_ROOT, '.vitest-attachments');

/**
 * recursively walks `projects/`, deleting every `__screenshots__` directory it finds while skipping
 * `node_modules` and not descending into a `__screenshots__` directory after it has been removed.
 */
const deleteScreenshotDirectories = (rootPath) => {
  if (!fs.existsSync(rootPath)) {
    return 0;
  }

  let deletedCount = 0;
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name === 'node_modules') {
      continue;
    }

    const entryPath = path.join(rootPath, entry.name);

    if (entry.name === SCREENSHOTS_DIR_NAME) {
      fs.rmSync(entryPath, { recursive: true, force: true });
      console.log(`deleted ${path.relative(REPO_ROOT, entryPath)}`);
      deletedCount += 1;

      continue;
    }

    deletedCount += deleteScreenshotDirectories(entryPath);
  }

  return deletedCount;
};

/**
 * deletes the root `.vitest-attachments` directory, treating a missing directory as a no-op.
 */
const deleteVitestAttachments = () => {
  if (!fs.existsSync(VITEST_ATTACHMENTS_DIR)) {
    return false;
  }

  fs.rmSync(VITEST_ATTACHMENTS_DIR, { recursive: true, force: true });
  console.log(`deleted ${path.relative(REPO_ROOT, VITEST_ATTACHMENTS_DIR)}`);

  return true;
};

const deletedScreenshotCount = deleteScreenshotDirectories(PROJECTS_ROOT);
const deletedVitestAttachments = deleteVitestAttachments();

console.log(
  `cleaned ${deletedScreenshotCount} ${SCREENSHOTS_DIR_NAME} ` +
    `${deletedScreenshotCount === 1 ? 'directory' : 'directories'} and ` +
    `${deletedVitestAttachments ? 1 : 0} .vitest-attachments directory`
);
