import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

/** default value for the label input */
export const DESIGN_SYSTEM_DEMO_CONTROLS_GROUP_LABEL_DEFAULT = '';

/**
 * a labeled group of related `org-design-system-demo-control-input` elements inside an
 * `org-design-system-demo-controls` row — renders a group label above its control inputs, which flow
 * in a wrappable flex row. each group takes its own full-width row so groups stack vertically.
 */
@Component({
  selector: 'org-design-system-demo-controls-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-controls-group.html',
  styleUrl: './design-system-demo-controls-group.css',
  host: {
    role: 'group',
    '[attr.aria-labelledby]': 'hasLabel() ? labelId : null',
  },
})
export class DesignSystemDemoControlsGroup {
  /** the group label shown above the grouped control inputs */
  public readonly label = input<string>(DESIGN_SYSTEM_DEMO_CONTROLS_GROUP_LABEL_DEFAULT);

  /** whether the label has a non-empty value */
  protected readonly hasLabel = computed<boolean>(() => !!this.label());

  /** stable unique id for the label element; the host references it from aria-labelledby */
  protected readonly labelId = `design-system-demo-controls-group-label-${uuidv4()}`;
}
