import { generateVariables, type GeneratedVariables } from './lib/variables';
import { ensurePage, clearPage, removeCollectionByName } from './lib/idempotency';
import { loadFonts, resetFontCache } from './lib/fonts';
import { COLLECTION_NAME, PAGES } from './lib/tokens';

import { generateButton } from './components/button';
import { generateTag } from './components/tag';
import { generateInput } from './components/input';
import { generateCheckbox } from './components/checkbox';
import { generateRadio } from './components/radio';
import { generateIcon } from './components/icon';
import { generateLabel } from './components/label';
import { generateLoadingSpinner } from './components/loading-spinner';

type UiMessage = { type: 'generate'; includeVariables: boolean; components: string[] } | { type: 'cancel' };

type GeneratorEntry = {
  name: string;
  fn: (vars: GeneratedVariables, page: PageNode) => Promise<ComponentSetNode> | ComponentSetNode;
};

const GENERATORS: GeneratorEntry[] = [
  { name: 'icon', fn: generateIcon },
  { name: 'loading-spinner', fn: generateLoadingSpinner },
  { name: 'label', fn: generateLabel },
  { name: 'checkbox', fn: generateCheckbox },
  { name: 'radio', fn: generateRadio },
  { name: 'tag', fn: generateTag },
  { name: 'input', fn: generateInput },
  { name: 'button', fn: generateButton },
];

function sendProgress(message: string): void {
  figma.ui.postMessage({ type: 'progress', message });
}

function sendDone(message: string): void {
  figma.ui.postMessage({ type: 'done', message });
}

function sendError(message: string): void {
  figma.ui.postMessage({ type: 'error', message });
}

function layoutVertically(page: PageNode, gap = 64): void {
  let y = 0;

  for (const child of page.children) {
    if ('y' in child && 'x' in child && 'height' in child) {
      child.x = 0;
      child.y = y;
      y += child.height + gap;
    }
  }
}

async function handleGenerate(includeVariables: boolean, requestedComponents: string[]): Promise<void> {
  sendProgress('Resetting workspace…');

  // idempotent reset: drop existing pages and variable collection by well-known names
  const oldComponentsPage = figma.root.children.find((c) => c.name === PAGES.components);

  if (oldComponentsPage) oldComponentsPage.remove();

  if (includeVariables) {
    removeCollectionByName(COLLECTION_NAME);
  }

  resetFontCache();

  sendProgress('Loading fonts…');
  await loadFonts();

  let vars: GeneratedVariables;

  if (includeVariables) {
    sendProgress('Creating variables (primitives + components, light/dark)…');
    vars = generateVariables();
  } else {
    // when not regenerating variables, still need a handle to existing ones for component generation
    const existing = figma.variables.getLocalVariableCollections().find((c) => c.name === COLLECTION_NAME);

    if (!existing) {
      throw new Error('Variables not found and "Variables" checkbox is off — run with Variables enabled first.');
    }

    const byName = new Map<string, Variable>();
    const allVars = figma.variables.getLocalVariables();

    for (const variable of allVars) {
      if (variable.variableCollectionId === existing.id) byName.set(variable.name, variable);
    }

    vars = {
      collection: existing,
      lightModeId: existing.modes[0].modeId,
      darkModeId: existing.modes[1]?.modeId ?? existing.modes[0].modeId,
      byName,
    };
  }

  const componentsPage = ensurePage(PAGES.components);
  clearPage(componentsPage);
  figma.currentPage = componentsPage;

  const selectedSet = new Set(requestedComponents);
  const toGenerate = GENERATORS.filter((g) => selectedSet.has(g.name));

  for (const entry of toGenerate) {
    sendProgress(`Generating ${entry.name}…`);

    try {
      await entry.fn(vars, componentsPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new Error(`Failed generating ${entry.name}: ${message}`);
    }
  }

  layoutVertically(componentsPage);

  sendDone(
    `Done. Generated ${toGenerate.length} component sets${includeVariables ? ' + variables' : ''}. Use File → Save local copy.`
  );
}

figma.showUI(__html__, { width: 320, height: 460, themeColors: true });

figma.ui.onmessage = async (msg: UiMessage) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();

    return;
  }

  if (msg.type === 'generate') {
    try {
      await handleGenerate(msg.includeVariables, msg.components);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error(error);
      sendError(message);
    }

    return;
  }
};
