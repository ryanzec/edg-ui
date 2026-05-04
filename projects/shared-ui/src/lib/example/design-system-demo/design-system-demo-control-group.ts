import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** default value for the label input */
export const DESIGN_SYSTEM_DEMO_CONTROL_GROUP_LABEL_DEFAULT = '';

/**
 * a labeled wrapper for a single control inside an `org-design-system-demo-controls` row — renders a
 * small uppercase label above projected control content.
 */
@Component({
  selector: 'org-design-system-demo-control-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-control-group.html',
  styleUrl: './design-system-demo-control-group.css',
})
export class DesignSystemDemoControlGroup {
  /** the small uppercase label shown above the control */
  public readonly label = input<string>(DESIGN_SYSTEM_DEMO_CONTROL_GROUP_LABEL_DEFAULT);

  /** whether the label has a non-empty value */
  protected readonly hasLabel = computed<boolean>(() => !!this.label());
}
