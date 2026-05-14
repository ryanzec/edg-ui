/** find a top-level page in the current document by exact name */
export function findPageByName(name: string): PageNode | null {
  for (const page of figma.root.children) {
    if (page.name === name) return page;
  }

  return null;
}

/** find a top-level page by name, creating it if absent */
export function ensurePage(name: string): PageNode {
  const existing = findPageByName(name);

  if (existing) return existing;

  const created = figma.createPage();
  created.name = name;

  return created;
}

/** remove all children from a page; used to clear before re-populating */
export function clearPage(page: PageNode): void {
  for (const child of [...page.children]) {
    child.remove();
  }
}

/** locate the local variable collection by name, returning null when not present */
export function findCollectionByName(name: string): VariableCollection | null {
  const collections = figma.variables.getLocalVariableCollections();

  for (const collection of collections) {
    if (collection.name === name) return collection;
  }

  return null;
}

/** delete a local variable collection (and all its variables) by name when it exists */
export function removeCollectionByName(name: string): void {
  const existing = findCollectionByName(name);

  if (existing) existing.remove();
}
