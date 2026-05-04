import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * the outer frame of an anatomy documentation block — composes a header slot, a stage slot (controls
 * + canvas), and an optional annotation slot into a single bordered surface used to document one part
 * of a component's anatomy.
 *
 * intended composition (each child uses a `slot="…"` attribute):
 * - `slot="header"`   → an `<org-design-system-demo-header>` element with title + description
 * - `slot="controls"` → an optional `<org-design-system-demo-controls>` element wrapping toggles / buttons
 * - `slot="canvas"`   → an `<org-design-system-demo-canvas>` element wrapping the visual demo
 * - `slot="annotation"` → optional inline markup (typically a `<dl>`) describing tokens / values
 */
@Component({
  selector: 'org-design-system-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo.html',
  styleUrl: './design-system-demo.css',
})
export class DesignSystemDemo {}
