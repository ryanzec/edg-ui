import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * a stylistic helper rendered as the trailing meta slot inside an overlay menu row — used for keyboard
 * shortcut text, a sub-menu chevron, or a small status tag. paints itself with muted foreground, tabular
 * numerals, and the menu's meta font size so it never visually competes with the row's primary label.
 */
@Component({
  selector: 'org-overlay-menu-item-meta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overlay-menu-item-meta.html',
  styleUrl: './overlay-menu-item-meta.css',
})
export class OverlayMenuItemMeta {}
