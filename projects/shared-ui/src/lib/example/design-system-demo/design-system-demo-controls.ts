import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * horizontal control row container — projects any number of toggles, buttons, or other interactive
 * controls into a single aligned row above the canvas area of an anatomy demo block.
 */
@Component({
  selector: 'org-design-system-demo-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-controls.html',
  styleUrl: './design-system-demo-controls.css',
  host: {
    role: 'group',
  },
})
export class DesignSystemDemoControls {}
