'use strict';

const fs = require('fs');
const path = require('path');
const { countTokens } = require('@anthropic-ai/tokenizer');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const SCAN_TARGETS = [
  { label: 'CLAUDE.md', root: path.join(REPO_ROOT, '.claude/CLAUDE.md') },
  { label: '.claude/rules', root: path.join(REPO_ROOT, '.claude/rules') },
  { label: '.claude/skills', root: path.join(REPO_ROOT, '.claude/skills') },
];

/**
 * pricing in usd per 1 million tokens.
 * sources verified 2026-05-23:
 * - opus 4.7: https://www.anthropic.com/news/claude-opus-4-7 ($5 input / $25 output, same as opus 4.6)
 * - sonnet 4.6: https://www.anthropic.com/pricing
 * cache write reflects the 5-minute ttl tier (claude code default).
 * cache rates derived from standard anthropic multipliers (5m write = 1.25x input, read = 0.1x input).
 */
const PRICING = {
  'sonnet-4.6': {
    input: 3.0,
    cacheWrite5m: 3.75,
    cacheRead: 0.3,
  },
  'opus-4.7': {
    input: 5.0,
    cacheWrite5m: 6.25,
    cacheRead: 0.5,
  },
};

const MILLION = 1_000_000;

const walkMarkdownFiles = (rootPath) => {
  const stat = fs.statSync(rootPath);

  if (stat.isFile()) {
    return rootPath.endsWith('.md') ? [rootPath] : [];
  }

  const results = [];
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
};

const measureFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const chars = content.length;
  const tokens = countTokens(content);

  return { filePath, chars, tokens };
};

const formatNumber = (value) => value.toLocaleString('en-US');

const formatCost = (value) => {
  if (value >= 1) {
    return `$${value.toFixed(4)}`;
  }

  return `$${value.toFixed(6)}`;
};

const calculateCost = (tokens, ratePerMillion) => (tokens / MILLION) * ratePerMillion;

const padRight = (value, width) => {
  const text = String(value);

  if (text.length >= width) {
    return text;
  }

  return text + ' '.repeat(width - text.length);
};

const padLeft = (value, width) => {
  const text = String(value);

  if (text.length >= width) {
    return text;
  }

  return ' '.repeat(width - text.length) + text;
};

const printTable = (headers, rows) => {
  const widths = headers.map((header, columnIndex) => {
    const headerWidth = header.length;
    const maxCellWidth = rows.reduce((max, row) => Math.max(max, String(row[columnIndex]).length), 0);

    return Math.max(headerWidth, maxCellWidth);
  });

  const renderRow = (cells, aligners) =>
    cells.map((cell, columnIndex) => aligners[columnIndex](cell, widths[columnIndex])).join('  ');

  const headerAligners = headers.map(() => padRight);
  const cellAligners = headers.map((_, columnIndex) => (columnIndex === 0 ? padRight : padLeft));

  console.log(renderRow(headers, headerAligners));
  console.log(widths.map((width) => '-'.repeat(width)).join('  '));

  for (const row of rows) {
    console.log(renderRow(row, cellAligners));
  }
};

const buildFileRows = (measurements) =>
  measurements
    .slice()
    .sort((first, second) => second.tokens - first.tokens)
    .map((measurement) => [
      path.relative(REPO_ROOT, measurement.filePath),
      formatNumber(measurement.chars),
      formatNumber(measurement.tokens),
    ]);

const summarizeTargetGroup = (label, measurements) => {
  const totalTokens = measurements.reduce((sum, measurement) => sum + measurement.tokens, 0);
  const totalChars = measurements.reduce((sum, measurement) => sum + measurement.chars, 0);
  const fileCount = measurements.length;

  return { label, totalChars, totalTokens, fileCount };
};

const printCostTable = (totalTokens) => {
  const rows = [];

  for (const [model, rates] of Object.entries(PRICING)) {
    rows.push([
      model,
      formatCost(calculateCost(totalTokens, rates.input)),
      formatCost(calculateCost(totalTokens, rates.cacheWrite5m)),
      formatCost(calculateCost(totalTokens, rates.cacheRead)),
    ]);
  }

  printTable(['model', 'standard input', 'cache write (5m)', 'cache read'], rows);
};

const main = () => {
  const allMeasurements = [];
  const groupSummaries = [];

  for (const target of SCAN_TARGETS) {
    if (!fs.existsSync(target.root)) {
      console.warn(`warning: target does not exist, skipping: ${target.root}`);
      continue;
    }

    const files = walkMarkdownFiles(target.root);
    const measurements = files.map(measureFile);

    allMeasurements.push(...measurements);
    groupSummaries.push(summarizeTargetGroup(target.label, measurements));
  }

  console.log('');
  console.log('=== per-file breakdown (sorted by tokens, descending) ===');
  console.log('');
  printTable(['file', 'chars', 'tokens'], buildFileRows(allMeasurements));

  console.log('');
  console.log('=== per-target subtotals ===');
  console.log('');
  printTable(
    ['target', 'files', 'chars', 'tokens'],
    groupSummaries.map((summary) => [
      summary.label,
      formatNumber(summary.fileCount),
      formatNumber(summary.totalChars),
      formatNumber(summary.totalTokens),
    ]),
  );

  const grandTotalTokens = allMeasurements.reduce((sum, measurement) => sum + measurement.tokens, 0);
  const grandTotalChars = allMeasurements.reduce((sum, measurement) => sum + measurement.chars, 0);

  console.log('');
  console.log('=== grand total ===');
  console.log('');
  console.log(`files:  ${formatNumber(allMeasurements.length)}`);
  console.log(`chars:  ${formatNumber(grandTotalChars)}`);
  console.log(`tokens: ${formatNumber(grandTotalTokens)}`);

  console.log('');
  console.log('=== estimated cost per single load of this context ===');
  console.log('');
  printCostTable(grandTotalTokens);

  console.log('');
  console.log('notes:');
  console.log('- token counts use @anthropic-ai/tokenizer (claude tokenizer, approximate for newer models).');
  console.log('- pricing reflects published rates as of 2026-05-23 (see PRICING constant in this script).');
  console.log('- "cache write (5m)" is the default ttl used by claude code; cache reads dominate steady-state cost.');
  console.log('');
};

main();
