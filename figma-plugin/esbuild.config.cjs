'use strict';

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const watch = process.argv.includes('--watch');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

async function buildCode() {
  const options = {
    entryPoints: [path.join(SRC, 'code.ts')],
    bundle: true,
    outfile: path.join(DIST, 'code.js'),
    target: 'es2020',
    format: 'iife',
    platform: 'browser',
    legalComments: 'none',
    logLevel: 'info',
  };

  if (watch) {
    const ctx = await esbuild.context(options);

    await ctx.watch();

    return ctx;
  }

  await esbuild.build(options);

  return null;
}

function copyUi() {
  const src = path.join(SRC, 'ui.html');
  const dest = path.join(DIST, 'ui.html');

  fs.mkdirSync(DIST, { recursive: true });
  fs.copyFileSync(src, dest);

  console.log(`copied ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
}

async function main() {
  fs.mkdirSync(DIST, { recursive: true });

  await buildCode();
  copyUi();

  if (watch) {
    console.log('watching for changes...');
    // watch ui.html separately
    fs.watch(path.join(SRC, 'ui.html'), { persistent: true }, () => {
      try {
        copyUi();
      } catch (error) {
        console.error('failed to copy ui.html', error);
      }
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
