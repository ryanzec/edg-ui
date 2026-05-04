import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * the visual stage of an anatomy demo block — provides the bordered, muted-surface frame inside which
 * a freely-projected demo example is rendered.
 */
@Component({
  selector: 'org-design-system-demo-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-canvas.html',
  styleUrl: './design-system-demo-canvas.css',
})
export class DesignSystemDemoCanvas {}
