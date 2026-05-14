/** font family priority list — primary first, fallbacks after; figma's bundled inter is the last resort */
const PREFERRED_SANS_FAMILIES = ['Inter', 'Geist Sans'];

const PREFERRED_MONO_FAMILIES = ['JetBrains Mono', 'Inter'];

const STYLE_PRIORITY = ['Regular', 'Medium', 'SemiBold', 'Bold'];

type ResolvedFont = {
  family: string;
  regular: FontName;
  medium: FontName;
  semibold: FontName;
  bold: FontName;
};

let cached: ResolvedFont | null = null;

async function resolveFamily(preferred: string[]): Promise<string> {
  const available = await figma.listAvailableFontsAsync();
  const families = new Set(available.map((f) => f.fontName.family));

  for (const name of preferred) {
    if (families.has(name)) return name;
  }

  return 'Inter';
}

function pickStyle(available: Set<string>, requested: string): string {
  if (available.has(requested)) return requested;

  for (const candidate of STYLE_PRIORITY) {
    if (available.has(candidate)) return candidate;
  }

  // last resort — return whatever style we can find
  return available.values().next().value ?? 'Regular';
}

async function loadFamilyStyles(family: string): Promise<ResolvedFont> {
  const available = await figma.listAvailableFontsAsync();
  const styles = new Set(available.filter((f) => f.fontName.family === family).map((f) => f.fontName.style));

  const resolved: ResolvedFont = {
    family,
    regular: { family, style: pickStyle(styles, 'Regular') },
    medium: { family, style: pickStyle(styles, 'Medium') },
    semibold: { family, style: pickStyle(styles, 'SemiBold') },
    bold: { family, style: pickStyle(styles, 'Bold') },
  };

  await figma.loadFontAsync(resolved.regular);
  await figma.loadFontAsync(resolved.medium);
  await figma.loadFontAsync(resolved.semibold);
  await figma.loadFontAsync(resolved.bold);

  return resolved;
}

/** resolves the codebase's preferred sans family (with fallback to inter) and pre-loads its common styles */
export async function loadFonts(): Promise<ResolvedFont> {
  if (cached) return cached;

  const family = await resolveFamily(PREFERRED_SANS_FAMILIES);

  cached = await loadFamilyStyles(family);

  return cached;
}

/** map a numeric css font-weight value to one of the cached family styles */
export function fontForWeight(fonts: ResolvedFont, weight: number): FontName {
  if (weight >= 700) return fonts.bold;

  if (weight >= 600) return fonts.semibold;

  if (weight >= 500) return fonts.medium;

  return fonts.regular;
}

/** force the font cache to refresh on the next call (used when re-running across font changes) */
export function resetFontCache(): void {
  cached = null;
}

export { PREFERRED_MONO_FAMILIES };
