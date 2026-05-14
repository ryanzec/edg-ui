/** all icon names available in the pilot plugin output */
export type IconName =
  | 'loader'
  | 'x'
  | 'eye'
  | 'eye-off'
  | 'square'
  | 'square-check-big'
  | 'square-minus'
  | 'check'
  | 'chevron-right'
  | 'triangle-alert';

/** lucide icons are authored as a 24×24 viewBox with stroke-only paths */
const VIEWBOX = 24;

/** lucide icon path bodies — each is the inner markup of a 24x24 lucide-style svg.
 *  consumers wrap these with a `<svg>` that supplies stroke + size + color attributes.
 */
const PATHS: Record<IconName, string> = {
  loader:
    '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':
    '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  square: '<rect width="18" height="18" x="3" y="3" rx="2"/>',
  'square-check-big':
    '<path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><path d="m9 11 3 3L22 4"/>',
  'square-minus': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'triangle-alert':
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
};

/** wraps the path body in a full lucide-style svg with the given pixel size; figma will render it as vector strokes */
export function svgFor(name: IconName, sizePx: number): string {
  const body = PATHS[name];

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" ` +
    `viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  );
}

export const ALL_ICON_NAMES: readonly IconName[] = [
  'loader',
  'x',
  'eye',
  'eye-off',
  'square',
  'square-check-big',
  'square-minus',
  'check',
  'chevron-right',
  'triangle-alert',
];
