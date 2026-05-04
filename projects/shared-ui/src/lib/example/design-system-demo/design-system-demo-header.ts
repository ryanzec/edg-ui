import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** default value for the title input */
export const DESIGN_SYSTEM_DEMO_HEADER_TITLE_DEFAULT = '';

/** default value for the description input */
export const DESIGN_SYSTEM_DEMO_HEADER_DESCRIPTION_DEFAULT = '';

/** default value for the eyebrow input */
export const DESIGN_SYSTEM_DEMO_HEADER_EYEBROW_DEFAULT = '';

/**
 * header section for an anatomy demo block — renders an optional eyebrow label, a title heading, and a
 * description paragraph above the demo body.
 */
@Component({
  selector: 'org-design-system-demo-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system-demo-header.html',
  styleUrl: './design-system-demo-header.css',
})
export class DesignSystemDemoHeader {
  /** the section title rendered as the primary heading */
  public readonly title = input<string>(DESIGN_SYSTEM_DEMO_HEADER_TITLE_DEFAULT);

  /** supporting description text rendered beneath the title */
  public readonly description = input<string>(DESIGN_SYSTEM_DEMO_HEADER_DESCRIPTION_DEFAULT);

  /** small uppercase eyebrow label rendered above the title */
  public readonly eyebrow = input<string>(DESIGN_SYSTEM_DEMO_HEADER_EYEBROW_DEFAULT);

  /** whether the eyebrow label has a non-empty value */
  protected readonly hasEyebrow = computed<boolean>(() => !!this.eyebrow());

  /** whether the title has a non-empty value */
  protected readonly hasTitle = computed<boolean>(() => !!this.title());

  /** whether the description has a non-empty value */
  protected readonly hasDescription = computed<boolean>(() => !!this.description());
}
