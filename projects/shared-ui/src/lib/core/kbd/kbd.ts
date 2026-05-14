import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * a quiet inset pill that renders a keyboard shortcut hint. inverse-color tooltip surfaces override the
 * `--kbd-*` tokens within their content scope so the pill remains legible on dark tooltip backgrounds.
 */
@Component({
  selector: 'org-kbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kbd.html',
  styleUrl: './kbd.css',
})
export class Kbd {}
