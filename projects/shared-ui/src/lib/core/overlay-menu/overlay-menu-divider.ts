import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '../divider/divider';

/** a thin wrapper around `<org-divider />` intended for use as a visual separator between items inside an overlay menu */
@Component({
  selector: 'org-overlay-menu-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Divider],
  template: '<org-divider direction="horizontal" />',
})
export class OverlayMenuDivider {}
