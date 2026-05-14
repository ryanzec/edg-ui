/**
 * thin re-export preserved so existing imports of `TooltipKbd` keep resolving after the kbd primitive
 * was promoted out of the tooltip folder. consumers should prefer the `Kbd` export and `<org-kbd>`
 * selector going forward.
 */
export { Kbd as TooltipKbd } from '../kbd/kbd';
