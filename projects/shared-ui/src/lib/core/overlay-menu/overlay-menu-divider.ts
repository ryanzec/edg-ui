import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '../divider/divider';

/**
 * a thin wrapper around `<org-divider />` intended for use as a visual separator between items inside an
 * overlay menu. the inner `<org-divider />` carries the `role="separator"` semantic; this wrapper owns the
 * menu-tight `margin-block` rhythm so the panel padding does not look loose around grouped sections.
 */
@Component({
  selector: 'org-overlay-menu-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider],
  template: '<org-divider direction="horizontal" />',
  styleUrl: './overlay-menu-divider.css',
})
export class OverlayMenuDivider {}
