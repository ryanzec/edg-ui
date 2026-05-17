import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { UserDetailsSectionId } from './user-details-types';

/** default value for the index input */
export const USER_DETAILS_SECTION_ANCHOR_INDEX_DEFAULT = '';

/** default value for the title input */
export const USER_DETAILS_SECTION_ANCHOR_TITLE_DEFAULT = '';

/** default value for the subtitle input */
export const USER_DETAILS_SECTION_ANCHOR_SUBTITLE_DEFAULT = '';

@Component({
  selector: 'org-user-details-section-anchor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-details-section-anchor.html',
  styleUrl: './user-details-section-anchor.css',
  host: {
    class: 'block',
    '[id]': '"user-details-section-" + sectionId()',
    '[attr.data-section-id]': 'sectionId()',
  },
})
export class UserDetailsSectionAnchor {
  /** the section id used by scroll-spy to associate this anchor with the right-rail nav entry */
  public readonly sectionId = input.required<UserDetailsSectionId>();

  /** small numeric index label (e.g. "01", "02") rendered to the left of the title */
  public readonly index = input<string>(USER_DETAILS_SECTION_ANCHOR_INDEX_DEFAULT);

  /** the large section heading text */
  public readonly title = input<string>(USER_DETAILS_SECTION_ANCHOR_TITLE_DEFAULT);

  /** the muted descriptor text rendered to the right of the title */
  public readonly subtitle = input<string>(USER_DETAILS_SECTION_ANCHOR_SUBTITLE_DEFAULT);
}
